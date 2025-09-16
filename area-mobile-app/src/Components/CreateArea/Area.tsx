import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const Area = ({ label, onAdd, selectedItem, onDelete } : any) => {

  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: selectedItem ? "#6F17DF" : theme.primary }]}>
      <Text style={[styles.label, { color: theme.onPrimary }]}> 
        {selectedItem ? selectedItem.name : label} 
      </Text>
      {selectedItem ? 
        <TouchableOpacity style={[styles.removeButton]} onPress={() => {
          onDelete();
        }}>
          <Icon name="trash" size={15} color="red" style={styles.icon} />
        </TouchableOpacity>
        :
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent }]} onPress={onAdd}>
          <Icon name="plus" size={15} color="white" style={styles.icon} />
        </TouchableOpacity>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    flex: 1,
    fontWeight: '500',
    fontSize: 18,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  icon: {
    fontSize: 14,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default Area;
