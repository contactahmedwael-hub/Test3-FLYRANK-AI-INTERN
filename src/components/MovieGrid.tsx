import type { MovieSearchResult } from '../types/movie';
import { MovieCard } from './MovieCard';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

interface MovieGridProps {
  results: MovieSearchResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  onSelect: (imdbID: string) => void;
  emptyMessage?: string;
  /** Called instead of toggling a favourite when the user isn't logged in. */
  onRequireLogin?: () => void;
}

export function MovieGrid({
  results,
  isLoading,
  error,
  hasSearched,
  onSelect,
  emptyMessage = 'No results found. Try a different title.',
  onRequireLogin,
}: MovieGridProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { currentUser } = useAuth();

  function handleToggleFavorite(movie: MovieSearchResult) {
    if (!currentUser) {
      onRequireLogin?.();
      return;
    }
    toggleFavorite(movie);
  }

  if (isLoading) {
    return (
      <p className="status-message" role="status">
        Searching...
      </p>
    );
  }

  if (error) {
    return (
      <p className="status-message status-error" role="alert">
        {error}
      </p>
    );
  }

  if (!hasSearched) {
    return <p className="status-message">Start typing to search for a movie or show.</p>;
  }

  if (results.length === 0) {
    return <p className="status-message">{emptyMessage}</p>;
  }

  return (
    <div className="movie-grid" role="list">
      {results.map((movie) => (
        <div role="listitem" key={movie.imdbID}>
          <MovieCard
            movie={movie}
            onSelect={onSelect}
            isFavorite={isFavorite(movie.imdbID)}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
}