//@ts-nocheck

import React, { useState, useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text } from 'react-native';
import Header from '@components/Header';
import ServiceDropdown from '@components/Services/ServiceDropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AutomationContext } from '@contexts/AutomationContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ServicesPage = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const type = route.params.type;
  const services = route.params.services;
  const [selectedItem, setSelectedItem] = useState(null);
  const { setSelectedAction, setSelectedReaction } = useContext(AutomationContext);
  // Lorsque l'élément est sélectionné :
  const handleSelect = (item) => {
    if (type === "actions") {
      setSelectedAction(item);
    } else if (type === "reactions") {
      setSelectedReaction(item);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <Header title="Vos services" subtitle="Gérez vos services" showBackArrow={true} />
        </View>
      </TouchableWithoutFeedback>
      <FlatList 
        data={services}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: service }) => {
          return (
            <ServiceDropdown
              service={service}
              selectedItem={selectedItem}
              type={type}
              onSelectItem={(item) => {
                if (item === selectedItem) return setSelectedItem(null);
                setSelectedItem(item);
                handleSelect({"serviceId": service.id, item});
              }}
            />
          )}
        }
      />
      {
        selectedItem && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.goBack()}>
              <Icon name="check" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    borderRadius: 28,
    elevation: 8
  },
  container: {
    padding: 16,
    justifyContent: 'flex-start', // pour assurer que les éléments commencent en haut
  },
  searchContainer: {
    height: 40, // augmenté la hauteur pour une meilleure visibilité
    borderRadius: 25,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 20,
    marginBottom: 20, // augmenté la marge pour séparer la barre de recherche de la liste
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,  // ajoutez une marge pour séparer l'icône du TextInput
  },
  closeIcon: {
    marginRight: 15,  // ajoutez une marge pour séparer l'icône du TextInput
  },
  searchBar: {
    flex: 1,  // cela permet à TextInput d'occuper tout l'espace restant dans la View
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 50,
    elevation: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ServicesPage;
