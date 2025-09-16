//@ts-nocheck
import { AuthContextProps } from '../types/AuthType';
import { createContext, useEffect, useState, ReactNode } from 'react';

export const AuthContext = createContext<any>();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string>("");

  const contextValue = {
    setCurrentUser,
    currentUser,
  };

  const logout = async () => {
    setCurrentUser("");
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
