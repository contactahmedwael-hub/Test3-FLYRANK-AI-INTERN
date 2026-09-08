import { useFavorites } from '../context/FavoritesContext';
import { MovieGrid } from '../components/MovieGrid';

interface FavoritesPageProps {
  onSelect: (imdbID: string) => void;
}

export function FavoritesPage({ onSelect }: FavoritesPageProps) {
  const { favorites, isLoading, error } = useFavorites();

  return (
    <div>
      <h2 className="page-heading">Your Favourites</h2>
      <MovieGrid
        results={favorites}
        isLoading={isLoading}
        error={error}
        hasSearched
        onSelect={onSelect}
        emptyMessage="You haven't added any favourites yet. Click the heart on a movie to save it here."
      />
    </div>
  );
}
