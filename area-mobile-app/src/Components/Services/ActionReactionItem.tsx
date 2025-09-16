import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatabaseService from '@services/DatabaseService';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '@contexts/AuthContext';
import { useAuthRequest, ResponseType, makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface ServiceData {
  name: string,
  isOAuth: boolean;
  id: number;
}

interface Creds {
  validUntil: Date;
  serviceId: number;
}

interface User {
  serviceCredentials: Creds[];
}

interface RequestData {
  link: string,
  clientId: string,
  scope: string,
  state: string,
  redirectUri: string,
}

interface authReponseData {
  message: string,
  status: number,
  code: string,
  state: string,
}

class AuthState {
  static NOT_AUTH = 0;
  static FETCHING_SERVICE = 1;
  static AUTH = 2;
  static FETCHING_REQUEST_DATA = 3;
  static FETCHING_REQUEST_DATA_FAILED = 4;
  static AUTH_SUCCESS = 5;
}

const ActionReactionItem = ({ item, onSelect, isSelected, requestData }: any) => {
  const { auth } = useAuth();
  const [authState, setAuthState] = useState<number>(0);
  const serviceDataRef = useRef<ServiceData | null>(null);
  const requestDataRef = useRef<RequestData | null>(null);

  const [request, response, promptAsync] = useAuthRequest({
    responseType: ResponseType.Code,
    clientId: requestData?.clientId || "",
    scopes: requestData?.scope?.split(" ") || [],
    usePKCE: false,
    state: requestData?.state,
    redirectUri: "exp://127.0.0.1:8082/"
  }, { authorizationEndpoint: requestData?.link || "" });

  useEffect(() => {
    const sendCodeOAuth = async (code : string) => {
      const response = await DatabaseService.sendCodeOAuth(code, item.service, requestData?.state || "", auth?.accessToken);
    }
    let code = null;
    if (response?.type === 'success') {
      code = response.params.code;
    }
    if (code) {
      sendCodeOAuth(code);
    }
  }, [response]);

  useEffect(() => {
    const fetchService = async () => {
      const response = await DatabaseService.fetchFromDatabase(auth?.accessToken, "services");
      response.forEach((service: any) => {
        if (service.name == item.service) {
          serviceDataRef.current = service;
        }
      });
    }

    const fetchUser = async () => {
      const response = await DatabaseService.fetchFromDatabase(auth?.accessToken, "users/me");
      return response
    }

    const fetchRequestData = async (): Promise<RequestData | null> => {
      if (!serviceDataRef.current)
        return null;
      return await DatabaseService.fetchFromDatabase(auth?.accessToken, `services/${serviceDataRef.current.name.toLowerCase()}/authData`)
    }

    if (!serviceDataRef.current && authState != 1) {
      fetchService().then(() => {
        setAuthState(1);
      }).catch((err) => {
        setAuthState(1);
        console.error(err);
      });
      return;
    }

    if (authState == AuthState.NOT_AUTH || authState == AuthState.FETCHING_SERVICE || authState != AuthState.AUTH)
      return;

    setAuthState(AuthState.FETCHING_REQUEST_DATA);
    if (serviceDataRef.current && !serviceDataRef.current.isOAuth) {
      setAuthState(AuthState.AUTH_SUCCESS);
      handleSelect(false);
      return;
    }
    fetchUser().then(async (user) => {
      if (serviceDataRef.current && user && user.serviceCredentials && (() => {
        let isValid = false;

        user.serviceCredentials.forEach((serviceCreds : Creds) => {
          if (serviceCreds.serviceId == serviceDataRef.current?.id &&
              new Date(serviceCreds.validUntil) > (new Date()))
            isValid = true;
        })
        return isValid;
      })()) {
        setAuthState(5);
        handleSelect(false)
      } else {
        setAuthState(4);
        fetchRequestData().then(async requestData => {
          if (!requestData || !serviceDataRef.current)
            throw new Error("requestData is null");
          requestDataRef.current = requestData;
          promptAsync();
        });
      }
    }).catch((err) => {
      console.error(err);
    });
  }, [authState]);

  const handleSelect = (isCalledFromButton : boolean) => {
    if (authState == 0 || authState == 1)
      setAuthState(2);
    if (authState != 5 && isCalledFromButton)
      return;
    onSelect(item);
  };

  return (
    <TouchableOpacity 
      style={[styles.itemContainer, isSelected && styles.selected]} 
      onPress={() => handleSelect(true)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
        {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
      </View>
      {isSelected && <Text style={styles.selectedText}>Sélectionné</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1, // Assurez-vous que le conteneur de texte utilise tout l'espace disponible
  },
  selected: {
    backgroundColor: '#E8F4FD',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold', // Vous pouvez choisir de rendre le texte principal plus gras
  },
  itemDescription: {
    fontSize: 14,
    color: '#6E6E6E',
    paddingTop: 5, // Un peu d'espace au-dessus de la description
  },
  selectedText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});

export default ActionReactionItem;
