import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ActionReactionItem from './ActionReactionItem';
import { useAuth } from '@contexts/AuthContext';
import DatabaseService from '@services/DatabaseService';

const ServiceDropdown = ({ service, type, selectedItem, onSelectItem }: any) => {

  const { auth } = useAuth();
  const [requestData, setRequestData] = React.useState<any>(null);

  if (!service[type]) return null;

  if (service[type].length === 0) return null;

  const fetchRequestData = async (service: any) => {
    return await DatabaseService.fetchFromDatabase(auth?.accessToken, `services/${service.name.toLowerCase()}/authData`)
  }

  useEffect(() => {
    fetchRequestData(service).then((data) => {
      setRequestData(data);
    }).catch((err) => {
      console.error(err);
    });
  }
  , []);

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.serviceTitle}>{service.name}</Text>
      {service && service[type] && service[type].length > 0 && service[type].map((item: any) => {
        item = { ...item, service: service.name };
        return (
          <ActionReactionItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedItem?.id} // Compare sur la base d'une propriété unique, par exemple `id`
            onSelect={(item: any) => {
              if (item.id === selectedItem?.id) return onSelectItem(null); // Encore une fois, comparez sur la base de `id`
              onSelectItem(item);
            }}
            requestData={requestData}
          />
        )
      })}
    </View>
  );
};


const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 30,
    borderRadius: 15, // Coins arrondis
    overflow: 'hidden',
    shadowOpacity: 0.1, // Ombre subtile
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#607D8B', // Une couleur neutre mais plus présente
    color: 'white', // Texte blanc pour contraste élevé
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)', // Ombre subtile pour le texte
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#CFD8DC', // Couleur de la ligne un peu plus marquée
    elevation: 3, // Ajoute une ombre pour Android (similaire à shadow* pour iOS)
  },
});
export default ServiceDropdown;
