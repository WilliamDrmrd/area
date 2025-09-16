import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, FlatList, RefreshControl, ScrollView, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@contexts/ThemeContext';
import Header from '@components/Header';
import DatabaseService from '@services/DatabaseService';
import { useAuth } from '@contexts/AuthContext';
import AutomationItem from '@components/Home/AutomationItem';

const Home = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { auth } = useAuth();
  const theme = useTheme();

  const fetchServices = async () => {
    if (!auth) return;
    setIsRefreshing(true);
    const response : any = await DatabaseService.fetchFromDatabase(auth.accessToken, "automations");
    const automationsOn = await DatabaseService.fetchFromDatabase(auth.accessToken, "automations/subscribed");
    response.forEach((automation : any) => {
      const found = automationsOn.automations.find((automationSubscribed : any) => {
        return automationSubscribed.id === automation.id;
      });
      automation.state = !!found;
    });
    setServices(response);
    setIsRefreshing(false);
  }

  const onRefresh = () => {
    fetchServices();
  }

  useEffect(() => {
    fetchServices();
  }, []);

  services && services.sort((a, b) => (a as any).name.localeCompare((b as any).name));

  return (
    <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Header title="Vos automatisations" subtitle="Gérez vos automatisations" />
          </View>
        </TouchableWithoutFeedback>

        {!services || services.length === 0 && (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[theme.secondary]}
                tintColor={theme.primary}
              />
            }
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

              <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text.color, marginBottom : 10}}>Aucune automatisation</Text>
              <Text style={{ fontSize: 16, color: theme.text.color, textAlign: 'center', marginHorizontal: 20, marginBottom : 10}}>Vous n'avez pas encore de service. Appuyez sur le bouton + pour en ajouter un. Puis tentez de rafraîchir la page</Text>
              <Icon name="exclamation-circle" size={50} color={theme.primary} />
            </View>
          </ScrollView>
        )}
        {services && services.length > 0 &&
            <FlatList
                keyboardShouldPersistTaps="handled"
                data={services}
                renderItem={({ item }) => {
                  if ((item as any).name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return <AutomationItem automation={item} setServices={setServices}/>
                  }
                  return null;
                }}
                keyExtractor={item => (item as any).id.toString()}
                ListHeaderComponent={
                    <View style={styles.container}>
                        <View style={[styles.searchContainer]}>
                            <Icon name="search" size={20} color={theme.primary} style={styles.searchIcon} />
                            <TextInput
                              placeholder="Rechercher un service"
                              placeholderTextColor={theme.text.color}
                              style={[styles.searchBar, { color: theme.text.color }]}
                              onChangeText={text => setSearchTerm(text)}
                              value={searchTerm}
                              clearButtonMode="always"
                              autoCapitalize="none"
                              autoCorrect={false}
                              returnKeyType="search"
                            />
                        </View>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={[theme.secondary]}
                        tintColor={theme.primary}
                    />
                }
            />
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
    height: 50,
    borderRadius: 25,  // Réduisez le rayon pour une forme plus ovale
    backgroundColor: '#f5f5f5',
    paddingLeft: 20,
    paddingRight: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.3,
  },
  searchIcon: {
    marginRight: 10, 
    color: '#8a8a8a'
  },
  closeIcon: {
    color: '#8a8a8a'
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 0,
  },
});

export default Home;
