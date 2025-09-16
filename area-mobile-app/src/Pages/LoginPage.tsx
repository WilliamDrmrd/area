import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import AccountService from '@services/AccountService';
import { Checkbox, Button, InputBox, SnackBar } from "@components/AccountManager/imports";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {

  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbarInfos, setSnackbarInfos] = useState({
    visible: false,
    message: '',
  });
  const { setAuth } = useAuth();
  const navigation = useNavigation();

  const handleRedirect = async (response : any) => {
    setAuth(response);
    await AsyncStorage.setItem('auth', JSON.stringify(response));
    navigation.navigate('AppNavigator' as never);
  }

  const handleLogin = async () => {

    const verifyFields = AccountService.verifyFields({ "email": email, "password": password });

    if (verifyFields !== true) {
      setSnackbarInfos({
        visible: true,
        message: verifyFields,
      });
      return;
    }

    const response = await AccountService.login(email, password);
    if (!response.access_token) {
      setSnackbarInfos({
        visible: true,
        message: response.message,
      });
      return;
    }
    handleRedirect(response);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <Text style={[styles.welcomeText, { color: theme.onPrimary }]}>Bon retour</Text>
        <Text style={[styles.connectText, { color: theme.onPrimary }]}>Connectez-vous à votre compte</Text>
        <View style={[styles.bottomContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.connexionText, { color: theme.text.color }]}>Connexion</Text>
          <InputBox label="Email" value={email} onChange={setEmail} theme={theme} />
          <InputBox label="Mot de passe" value={password} onChange={setPassword} isPassword={true} passwordVisible={passwordVisible} setPasswordVisible={setPasswordVisible} theme={theme} />
          {/* <View style={styles.checkboxContainer}>
            <Checkbox checked={rememberMe} onPress={() => setRememberMe(prev => !prev)} theme={theme} />
            <Text style={[styles.checkboxText, { color: theme.text.color }]}>Se souvenir de moi</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ForgottenPasswordPage' as never)}>
              <Text style={[styles.signupLink, { color: theme.primary }]}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View> */}
          <Button label="Connexion" onPress={handleLogin} theme={theme} />
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: theme.text.color }]}>Vous n'avez pas de compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
              <Text style={[styles.signupLink, { color: theme.primary }]}>Inscrivez-vous</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SnackBar snackbarInfos={snackbarInfos} setSnackbarInfos={setSnackbarInfos} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  welcomeText: {
    fontSize: 32,  // Vous pouvez ajuster la taille selon vos préférences
    fontWeight: 'bold',
    marginBottom: 10,  // espace entre "Bienvenue" et le texte suivant
  },
  connectText: {
    fontSize: 20,  // Vous pouvez également ajuster cette taille
    marginBottom: 20,  // espace entre "Connectez-vous à votre compte" et le container du bas
  },
  bottomContainer: {
    width: '100%',
    height: '75%',
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 40,
  },
  connexionText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',  // Pour aligner le texte à gauche
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',   // Pour le positionner juste au-dessus du bouton
    bottom: 40,             // Positionnement au-dessus du bouton
    alignSelf: 'center',
  },
  signupText: {
    fontWeight: 'bold',
  },
  signupLink: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '55%',
  },
});

export default LoginPage;
