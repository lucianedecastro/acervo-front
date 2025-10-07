import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // MUDANÇA: Ao iniciar, tenta carregar o token do localStorage
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const login = (newToken) => {
    // MUDANÇA: Guarda o token no localStorage
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    // MUDANÇA: Remove o token do localStorage
    localStorage.removeItem('authToken');
    setToken(null);
  };

  const value = { token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}