import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Checkbox = ({ checked = false, onPress = () => { }, theme } : any) => (
  <TouchableOpacity onPress={onPress} style={{ backgroundColor: theme.secondary, width: 20, height: 20, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
    {checked && <Icon name="check" size={20} color={theme.primary} />}
  </TouchableOpacity>
);

export default Checkbox;
