import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../Contexts/ThemeContext';
import { lightColors } from '../Contexts/theme';
import AccountService from '@services/AccountService';

const ConfirmationPage = ({ navigation } : any) => {
    const theme = useTheme();

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container, { backgroundColor: theme.primary }]}>
          <Text style={[styles.welcomeText, { color: theme.onPrimary }]}>Confirmer l'email</Text>
          <Text style={[styles.connectText, { color: theme.onPrimary }]}>Entrez le code reçu par mail</Text>
          <View style={[styles.bottomContainer, { backgroundColor: theme.background }]}>
            <View style={styles.inputBox}>
              <Text style={[styles.inputLabel, { color: theme.text.color }]}>Code</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.secondary }]} />
            </View>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]}>
              <Text style={[styles.buttonText, { color: theme.onPrimary }]}>Confirmer</Text>
            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: theme.text.color }]}>Vous avez déjà un compte ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
                <Text style={[styles.signupLink, { color: theme.primary }]}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    inputLabel: {
      fontSize: 14,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    inputBox: {
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 40,
      borderRadius: 5,
      padding: 10,
    },
    button: {
      borderRadius: 25,
      width: '90%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',   // Pour le positionner en bas de l'écran
      bottom: 80,             // Ajout d'une marge en bas pour espacer le bouton du bord
      alignSelf: 'center',
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 1,
      borderRadius: 2,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
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

  export default ConfirmationPage;