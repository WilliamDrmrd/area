import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from '@utils/AppNavigator';
import { useAuth } from '@contexts/AuthContext';
import TutorialPage from '@pages/TutorialPage';
import SignUp from '@pages/SignUp';
import LoginPage from '@pages/LoginPage';
import CreateArea from '@pages/CreateArea';
import ServicesPage from '@pages/Services';

const Stack = createNativeStackNavigator();

export default function Redirect() {

  const { userInfo, auth } = useAuth();

  function renderApp() {
    if (userInfo || auth) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AppNavigator" component={AppNavigator} />
          <Stack.Screen name="CreateArea" component={CreateArea} />
          <Stack.Screen name="ServicesPage" component={ServicesPage} />
          <Stack.Screen name="TutorialPage" component={TutorialPage} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )
    }
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TutorialPage" component={TutorialPage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="AppNavigator" component={AppNavigator} />
        <Stack.Screen name="CreateArea" component={CreateArea} />
        <Stack.Screen name="ServicesPage" component={ServicesPage} />
      </Stack.Navigator>
    )

  }

  return (
    <>
      {renderApp()}
    </>
  );
}
