import { ThemeProvider } from './src/Contexts/ThemeContext';
import { AuthProvider } from '@contexts/AuthContext';
import Redirect from './src/Redirect';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AutomationProvider } from '@contexts/AutomationContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <AutomationProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Redirect />
              </GestureHandlerRootView>
            </AutomationProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
