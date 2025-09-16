import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { lightColors } from '../../Contexts/theme';

const InputBox = ({ label, value, onChange, isPassword = false, passwordVisible, setPasswordVisible, theme } : any) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontSize: 14, marginBottom: 10, fontWeight: 'bold', color: theme.text.color }}>{label}</Text>
    <TextInput
      style={{ width: '100%', height: 40, borderRadius: 5, padding: 10, backgroundColor: theme.secondary }}
      onChangeText={onChange}
      secureTextEntry={isPassword && !passwordVisible}
    />
    {isPassword && (
      <Icon
        name={passwordVisible ? "eye-off" : "eye"}
        size={20}
        color={lightColors.text}
        onPress={() => setPasswordVisible((prev: boolean) => !prev)}
        style={{ position: 'absolute', right: 15, top: '55%', color: theme.text.color }}
      />
    )}
  </View>
);

export default InputBox;
