//ts-nocheck

import React, { useEffect, useState, useContext } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import Area from '@components/CreateArea/Area';
import DatabaseService from '@services/DatabaseService';
import { useAuth } from '@contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Header from '@components/Header';
import { AutomationContext } from '@contexts/AutomationContext';

const CreateArea = () => {

  const { auth } = useAuth();
  const theme = useTheme();
  const [services, setServices] = useState<any[]>([]);
  const [automationName, setAutomationName] = useState('');
  const [automationDescription, setAutomationDescription] = useState('');
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const { selectedAction, selectedReaction, setSelectedAction, setSelectedReaction } = useContext(AutomationContext);

  const fetchServices = async () => {
    if (!auth) return;
    const response = await DatabaseService.fetchFromDatabase(auth.accessToken, "services");
    setServices(response);
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const createAutomationWithModal = () => {
    toggleModal();
    createAutomation();
  };

  const resetFields = () => {
    setAutomationName('');
    setAutomationDescription('');
    setSelectedAction(null);
    setSelectedReaction(null);
  }

  const createAutomation = async () => {
    if (!auth) return;
    const response = await DatabaseService.createAutomation(
      automationName,
      automationDescription,
      selectedAction,
      selectedReaction,
      auth.accessToken
    );
    resetFields();
  }

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <Header title="AREA" subtitle="Créez votre automatisation" />
      <View style={styles.container}>
        {(!selectedAction || !selectedReaction) && 
          <Text style={styles.promptText}>Veuillez sélectionner une action et une réaction pour continuer.</Text>
        }
        <Area label="Action" onAdd={() => navigation.navigate('ServicesPage', { services, type: "actions" })} selectedItem={selectedAction ? selectedAction["item"] ?? null : null} onDelete={() => setSelectedAction(null)} />
        <Area label="Réaction" onAdd={() => navigation.navigate('ServicesPage', { services, type: "reactions" })} selectedItem={selectedReaction ? selectedReaction["item"] ?? null : null} onDelete={() => setSelectedReaction(null)} />
        {selectedAction && selectedReaction &&
          <TouchableOpacity style={[styles.addButton, { backgroundColor: "#C717DF" }]} onPress={toggleModal}>
            <Text style={styles.addButtonText}>Valider</Text>
          </TouchableOpacity>
        }
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => { toggleModal(); } }
        >
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={styles.modalView}>
                  <TextInput
                      style={[styles.input, { width: '90%' }]}
                      placeholder="Nom de l'automatisation"
                      value={automationName}
                      onChangeText={setAutomationName}
                      placeholderTextColor="#aaa"
                  />
                  <TextInput
                      style={[styles.input, styles.descriptionInput, { width: '80%' }]}
                      placeholder="Description de l'automatisation"
                      value={automationDescription}
                      onChangeText={setAutomationDescription}
                      placeholderTextColor="#aaa"
                      multiline
                  />
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignItems: 'center'}}>
                    <TouchableOpacity style={[styles.modalButton, {backgroundColor: 'red'}]} onPress={toggleModal}>
                      <Text style={styles.modalButtonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={createAutomationWithModal}>
                      <Text style={styles.modalButtonText}>Valider</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 40,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF'
  },
  headerContainer: {
    backgroundColor: '#FFF',
    padding: 40, // Cette ligne augmente le padding pour descendre le titre
    borderBottomWidth: 1,
    borderColor: '#EFEFEF'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 20,
    color: '#888888',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  descriptionInput: {
    height: 60,
  },
  addButton: {
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  icon: {
    marginLeft: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  promptText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalButton: {
    backgroundColor: "#385FDB",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width: 80
  }
});

export default CreateArea;
