import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ label, onPress, disabled = false, theme } : any) => (
  <TouchableOpacity
    style={{ borderRadius: 25, width: '90%', height: 50, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 80, alignSelf: 'center', backgroundColor: theme.primary }} 
    onPress={onPress}
    disabled={disabled}>
    <Text style={{ fontWeight: 'bold', fontSize: 18, color: theme.onPrimary }}>{label}</Text>
  </TouchableOpacity>
);

export default Button;
