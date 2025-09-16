import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { OAuthModal } from '@components/AccountManager/imports';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useAuth } from '@contexts/AuthContext';
import DatabaseService from '@services/DatabaseService';

const TutorialPage = ({ navigation }: any) => {
  const { handleOAuthPress } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorIp, setErrorIp] = useState(false);
  const { auth } = useAuth();
  const theme = useTheme();

  const validateIP = (ip: string) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!regex.test(ip)) {
      return "Erreur : Adresse IP invalide. Ne pas inclure \"http://\" ni \":port\".";
    }
    return "";
  }

  const verifyIp = async () => {
    setLoading(true);
    try {
      const response = await DatabaseService.verifyIpAdress(ipAddress);
      if (response) {
        setSuccess(true);
      } else {
        setSuccess(false);
        setErrorIp(true);
      }
    } catch (error) {
      console.log(error);
      setSuccess(false);
      setErrorIp(true);
    }
  }
  
  useEffect(() => {
    if (auth && auth.accessToken) {
      setModalVisible(false);
      navigation.navigate('AppNavigator' as never);
    }
  }, [auth]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <LottieView
          source={require('@assets/lotties/rocket.json')}
          autoPlay loop
          style={styles.lottie}
          testID='lottie-animation'
        />

        <Text style={[styles.connexionText, { color: theme.text.color }]}>Optimisez votre temps au maximum avec AREA</Text>
        <TextInput
          placeholder="Entrez l'adresse IP du serveur..."
          value={ipAddress}
          onChangeText={(text) => {
            if (text.length === 0 || validateIP(text) === "") {
              setErrorMessage('');
            }
            setIpAddress(text);
          }}
          style={[styles.ipInput, { color: theme.text.color }]}
          keyboardType="numbers-and-punctuation"
          onEndEditing={() => {
            if (ipAddress.length === 0) return;
            const error = validateIP(ipAddress);
            setErrorMessage(error);
          }}
        />

        {errorMessage != "" && <Text style={styles.errorText}>{errorMessage}</Text>}

        {errorMessage === "" && validateIP(ipAddress) === "" && (
          <>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={async () => await verifyIp()}>
              <Text style={[styles.buttonText, { color: theme.onPrimary }]}>Continuer</Text>
            </TouchableOpacity>

            {loading && !success && !errorIp && (
              <LottieView
                source={require('@assets/lotties/loading.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
            )}
            {loading && success && (
              <LottieView
                source={require('@assets/lotties/success.json')}
                autoPlay
                loop={false}
                style={styles.lottie}
                onAnimationFinish={() => {
                  setLoading(false);
                  setSuccess(false);
                  setModalVisible(true);
                }}
              />
            )}
            {errorIp && (
              <LottieView
                source={require('@assets/lotties/error.json')}
                autoPlay
                loop={false}
                style={styles.lottie}
                onAnimationFinish={() => {
                  setLoading(false);
                  setSuccess(false);
                  setErrorIp(false);
                }}
              />
            )}
            <OAuthModal
              isVisible={isModalVisible}
              onClose={() => setModalVisible(false)}
              onOAuthPress={async (service : any) => {  // Modifié ici
                const response = await handleOAuthPress(service);  // Modifié ici
                if (response) {
                  setModalVisible(false);
                  navigation.navigate('AppNavigator' as never);
                }
              }}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: 50,
  },
  lottie: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  connexionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    borderRadius: 25,
    padding: 15, // Padding augmenté pour un bouton plus grand
    alignItems: 'center',
    marginBottom: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  nstructionText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  ipInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 15, // Augmenté pour plus d'espacement
    paddingHorizontal: 25, // Augmenté pour plus d'espacement
    fontSize: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorText: {
    fontSize: 16, // Taille de police augmentée
    fontWeight: 'bold', // Police en gras
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,  // Espacement pour l'icône d'erreur, si ajoutée
  },
});

export default TutorialPage;
