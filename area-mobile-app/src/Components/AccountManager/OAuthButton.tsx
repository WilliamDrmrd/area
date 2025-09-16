import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@contexts/ThemeContext';

const OAuthButton = ({ label, iconName, onPress } : any) => {

  const theme = useTheme();
  return (
    <TouchableOpacity style={[styles.oauthButton, { borderColor: theme.primary }]} onPress={onPress}>
      <Icon name={iconName} size={25} color={theme.primary} style={{ marginRight: 15 }} />
      <Text style={[styles.oauthButtonText, { color: theme.primary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  oauthButton: {
    width: '80%',
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    borderWidth: 2,
  },
  oauthButtonText: {
    fontWeight: '600',
    fontSize: 18,
  },
});

export default OAuthButton;