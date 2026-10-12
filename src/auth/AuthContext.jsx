import { createContext, useContext } from "react";

export const defaultAuth = {
  isConfigured: false,
  isLoading: false,
  isAuthenticated: false,
  user: undefined,
  loginWithRedirect: undefined,
  logout: undefined,
  getAccessTokenSilently: undefined,
};

export const AuthContext = createContext(defaultAuth);
export const useAuth = () => useContext(AuthContext);
