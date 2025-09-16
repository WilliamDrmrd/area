import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from "react-native";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, EXPO_CLIENT_ID } from "@env";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser"

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response , promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: "537198270562-54d4cmp4rrjr2ecbnce1ur61d80rhf9b.apps.googleusercontent.com",
    iosClientId: IOS_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
    redirectUri: Platform.OS === "ios" ? "com.googleusercontent.apps.537198270562-4soin4b2f7p4p89fc329ifetbeq5a96h:/oauthredirect" : "exp://127.0.0.1:8082/",
  });
  const [requireRefresh, setRequireRefresh] = useState(false);
  const [auth, setAuth] = useState<any>();

  useEffect(() => {
    loadPersistedAuth();
    if (requireRefresh) {
      refreshToken(auth?.refreshToken);
    }
  }, [requireRefresh]);

  const getPersistedAuth = async () => {
    const jsonValue = await AsyncStorage.getItem("googleAuth");
    return jsonValue ? JSON.parse(jsonValue) : null;
  }

  const loadPersistedAuth = async () => {
    const persistedAuth = await getPersistedAuth();
    if (!persistedAuth) return;
    const isTokenFresh = AuthSession.TokenResponse.isTokenFresh({
      expiresIn: persistedAuth.expiresIn,
      issuedAt: persistedAuth.issuedAt
    });
    setAuth(persistedAuth);
    setRequireRefresh(!isTokenFresh);
  }

  const googleAuthenticate = async () => {
    await promptAsync();
    await AsyncStorage.setItem("googleAuth", JSON.stringify(response));
    return response;
  };

  const getUserData = async (accessToken: string) => {
    if (!accessToken) {
      console.log("No auth token");
      return null;
    }
    const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    return userInfoResponse.json();
  }

  const refreshToken = async (refreshToken: string) => {
    const client_id = await getClientId();
    const tokenResult = await AuthSession.refreshAsync({
      clientId: client_id ?? "",
      refreshToken: refreshToken ?? "",
    }, {
      tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token"
    });

    tokenResult.refreshToken = refreshToken ?? "";
    return tokenResult;
  }

  const googleLogout = async (accessToken: string) => {
    try {
      if (accessToken) {
        await AuthSession.revokeAsync({
          token: accessToken,
        }, {
          revocationEndpoint: "https://oauth2.googleapis.com/revoke"
        });
        await AsyncStorage.removeItem("googleAuth");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error);
    }
  }

  const getClientId = async () => {
    return Platform.OS === "ios" ? IOS_CLIENT_ID : ANDROID_CLIENT_ID;
  }

  return { googleAuthenticate, refreshToken, googleLogout, getUserData };
};
