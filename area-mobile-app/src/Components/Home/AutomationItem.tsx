import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@contexts/ThemeContext';
import DatabaseService from '@services/DatabaseService';
import { useAuth } from '@contexts/AuthContext';
import { Swipeable } from 'react-native-gesture-handler';

const AutomationItem = ({ automation, setServices } : any) => {

  const theme = useTheme();
  const { auth } = useAuth();

  const [isEnabled, setIsEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [additionalFields, setAdditionalFields] : any = useState<{ actions: any, reactions: any }>({ actions: {}, reactions: {} });

  const confirmDeletion = () => {
    Alert.alert(
      "Supprimer l'automatisation",
      "Êtes-vous sûr de vouloir supprimer cette automatisation ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { text: "Supprimer", onPress: () => handleDelete(), style: 'destructive' }
      ]
    );
  };

  const handleDelete = async () => {
    try {
      await DatabaseService.deleteAutomation(automation.id, auth?.accessToken);
      setServices((prev : any) => prev.filter((service : any) => service.id !== automation.id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'automatisation:", error);
    }
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity onPress={confirmDeletion} style={styles.deleteButton}>
        <Icon name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const toggleSwitch = async () => {
    try {
      if (isEnabled) {
        await handleSubmit();
      } else if (Object.keys(additionalFields.actions).length > 0 || Object.keys(additionalFields.reactions).length > 0) {
        setIsModalVisible(true);
      } else {
        await handleSubmit();
      }
    } catch (error) {
      console.error("Erreur lors du basculement:", error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsEnabled(automation.state);
        const response = await DatabaseService.getAutomationInfos(automation.id, auth?.accessToken);
        const additionnals = {
          "actions": response.action.additionalFields,
          "reactions": response.reaction.additionalFields,
        }

        // Réinitialisation des champs
        const resetFields : any = { ...additionnals };
        ['actions', 'reactions'].forEach((type : any)=> {
          Object.keys(resetFields[type]).forEach(key => {
            resetFields[type][key] = '';
          });
        });

        setAdditionalFields(resetFields);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'automatisation:", error);
      }
    }
    fetch();
  }, []);

  const resetFields = () => {
    const resetFields : any = { ...additionalFields };
    ['actions', 'reactions'].forEach(type => {
      Object.keys(resetFields[type]).forEach(key => {
        resetFields[type][key] = '';
      });
    });
    setAdditionalFields(resetFields);
  }

  const handleSubmit = async () => {
    if (isEnabled) {
      const response = await DatabaseService.unsubscribeAutomation(automation.id, auth?.accessToken);
      setIsEnabled(false);
      resetFields();
      return;
    }
    const response = await DatabaseService.subscribeAutomation(
      automation,
      additionalFields.actions,
      additionalFields.reactions,
      auth?.accessToken
    );
    setIsEnabled(true);
    resetFields();
  }

  return (
    <>
      <Swipeable renderRightActions={renderRightActions}>
        <View style={[styles.serviceItem, { backgroundColor: automation.backgroundColor }]}>
          <View style={styles.iconContainer}>
            <Icon name={automation.icon || 'cog'} size={24} color={automation.color || theme.primary} />
          </View>
          <View style={styles.serviceDetails}>
            <Text style={[styles.serviceName, {color: automation.color || theme.primary}]}>{automation.name}</Text>
            <Text style={styles.serviceDescription}>{automation.description}</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />
        </View>
        <View style={styles.divider} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(!isModalVisible);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
            {['actions', 'reactions'].map(type => (
              Object.keys(additionalFields[type]).length > 0 && (
                <View key={type} style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{type === 'actions' ? 'Actions' : 'Réactions'}</Text>
                  {Object.keys(additionalFields[type]).map(key => (
                    <TextInput
                      key={key}
                      placeholder={key}
                      style={styles.input}
                      value={additionalFields[type][key]}
                      onChangeText={text => setAdditionalFields((prev : any) => ({
                        ...prev,
                        [type]: {
                          ...prev[type],
                          [key]: text
                        }
                      }))}
                    />
                  ))}
                </View>
              )
            ))}
              <View style={styles.buttonsContainer}>
                <Button title="Annuler" onPress={() => setIsModalVisible(false)} color="#888" />
                <Button title="Valider" onPress={async () => {
                  setIsModalVisible(false);
                  await handleSubmit();
                }} color={theme.primary} />
              </View>
            </View>
          </View>
        </Modal>
      </Swipeable>
    </>
  );
};

const styles = StyleSheet.create({
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  serviceDetails: {
    flex: 1,
    marginLeft: 10,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
  },
  switch: {
    marginLeft: 'auto',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
    opacity: 0.6,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});

export default AutomationItem;
