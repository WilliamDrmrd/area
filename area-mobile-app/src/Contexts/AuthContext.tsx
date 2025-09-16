import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { UserInfo, AuthData } from './Types';
import { useGoogleAuth } from './useGoogleAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AccountService from '@services/AccountService';
import { useSpotifyAuth } from './useSpotifyAuth';

interface AuthContextType {
  userInfo: UserInfo | undefined;
  auth: AuthData | undefined;
  handleOAuthPress: (provider: string) => boolean | undefined;
  setAuth: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein d\'un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const [auth, setAuth] = useState<AuthData | undefined>();
  const navigation = useNavigation();

  const { googleAuthenticate, googleLogout, getUserData } = useGoogleAuth();
  const { spotifyAuthenticate } = useSpotifyAuth();

  const setAuthData = (data: any) => {
    setAuth(data);
  };

  // const loadPersistedAuth = async () => {
  //   const persistedAuth = await AsyncStorage.getItem("auth");
  //   if (!persistedAuth) return;
  //   setAuth(JSON.parse(persistedAuth));
  //   console.log(JSON.parse(persistedAuth));
  // }

  // useEffect(() => {
  //   loadPersistedAuth();
  // }, []);

  const handleOAuthPress = async (provider: string) => {
    switch (provider) {
      case 'google':
        const googleAuth = await googleAuthenticate();
        if (!googleAuth) return;
        const token = googleAuth?.authentication.accessToken;
        const userData = await getUserData(token);
        const response = await AccountService.connectWithOAuth(token, userData.email);
        setAuth(response);
        await AsyncStorage.setItem('auth', JSON.stringify(response));
        break;
      case 'spotify':
        const auth = await spotifyAuthenticate();
        setAuth(auth);
        await AsyncStorage.setItem('auth', JSON.stringify(auth));
        break;
      default:
        throw new Error('Service d\'authentification non reconnu');
    }
    return null;
  }

  const logout = async () => {
    await googleLogout(auth?.accessToken);
    setAuth(undefined);
    setUserInfo(undefined);
    await AsyncStorage.removeItem('auth');
    navigation.navigate('TutorialPage' as never);
  };

  return (
    <AuthContext.Provider value={{ userInfo, auth, handleOAuthPress, setAuth: setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
