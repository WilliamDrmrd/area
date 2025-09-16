import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@pages/Home';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@contexts/ThemeContext'
import LoginPage from '@pages/LoginPage';
import TutorialPage from '@pages/TutorialPage';
import CreateArea from '@pages/CreateArea';
// Importez les autres écrans que vous souhaitez ajouter à la barre de navigation ici

const Tab = createBottomTabNavigator();

export default function AppNavigator() {

  const theme = useTheme()

  return (
    <Tab.Navigator
      initialRouteName="Services"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondary,
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={CreateArea}
        options={{
          tabBarLabel: 'Marketplace',
          tabBarIcon: ({ color, size }) => (
            <Icon name="gear" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
