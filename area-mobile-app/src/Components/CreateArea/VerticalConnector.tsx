import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

const VerticalConnector = ({ onPlusPress }: { onPlusPress: () => void }) => {

  const theme = useTheme();
  
  return (
    <View style={styles.connectorContainer}>
      <View style={[styles.line, { marginBottom: 15 }]} />
      <TouchableOpacity style={[styles.plusButton, { backgroundColor: theme.accent }]} onPress={onPlusPress}>
        <Icon name="plus" size={15} color="white" style={styles.icon} />
      </TouchableOpacity>
      <View style={[styles.line, { marginTop: 15 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  connectorContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  line: {
    flex: 1,
    width: 3,
    backgroundColor: 'gray',
    zIndex: 0,
  },
  icon: {
    fontWeight: '100',
  },
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  plusButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default VerticalConnector;
