import { useAuth } from '../context/AuthContext';
import { AuthView } from './Auth/AuthView';
import { FavoritesPage } from './FavoritesPage';

interface FavoritesGateProps {
  onSelect: (imdbID: string) => void;
}

export function FavoritesGate({ onSelect }: FavoritesGateProps) {
  const { currentUser, authChecked } = useAuth();

  if (!authChecked) {
    return (
      <p className="status-message" role="status">
        Checking your session...
      </p>
    );
  }

  if (!currentUser) {
    return <AuthView />;
  }

  return <FavoritesPage onSelect={onSelect} />;
}