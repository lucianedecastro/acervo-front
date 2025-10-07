import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    // Se não houver token, redireciona para a página de login
    return <Navigate to="/login" />;
  }

  return children;
}