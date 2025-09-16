// OAuthModal.tsx
import React from 'react';
import Modal from 'react-native-modal';
import OAuthButton from './OAuthButton';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const OAuthModal = ({ isVisible, onClose, onOAuthPress } : any) => {
  const navigation = useNavigation();
  const theme = useTheme();
  
  return (
    <Modal 
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={{ margin: 0, justifyContent: 'flex-end' }}
      onBackdropPress={onClose}
    >
      <View style={{ 
        flex: 0.4,
        alignItems: 'center',
        justifyContent : "space-around",
        backgroundColor: theme.background,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
      }}>
        <OAuthButton 
          label="Se connecter avec Google" 
          iconName="google" 
          onPress={() => onOAuthPress('google')} 
        />

        <OAuthButton
          label="Se connecter par email"
          iconName="email"
          onPress={() => {
            navigation.navigate('SignUp');
            onClose();
          }}
        />

        <OAuthButton
          label="Se connecter avec Spotify"
          iconName="spotify"
          onPress={() => onOAuthPress('spotify')}
        />

        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: theme.primary, fontWeight: '600' }}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default OAuthModal;
