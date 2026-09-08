import { useEffect, useState } from 'react';
import { OmdbApiError, getMovieDetails } from '../services/omdbApi';
import type { MovieDetails } from '../types/movie';

interface MovieDetailsModalProps {
  imdbID: string;
  onClose: () => void;
}

export function MovieDetailsModal({ imdbID, onClose }: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getMovieDetails(imdbID, controller.signal)
      .then(setMovie)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof OmdbApiError ? err.message : 'Could not load movie details.');
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [imdbID]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={movie ? movie.Title : 'Movie details'}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {isLoading && (
          <p className="status-message" role="status">
            Loading details...
          </p>
        )}

        {error && (
          <p className="status-message status-error" role="alert">
            {error}
          </p>
        )}

        {movie && !isLoading && !error && (
          <div className="movie-details">
            {movie.Poster !== 'N/A' && (
              <img src={movie.Poster} alt={`${movie.Title} poster`} className="movie-details-poster" />
            )}
            <div className="movie-details-info">
              <h2>
                {movie.Title} <span className="movie-details-year">({movie.Year})</span>
              </h2>
              <p className="movie-details-meta">
                <span className="meta-chip">{movie.Rated}</span>
                <span className="meta-chip">{movie.Runtime}</span>
                <span className="meta-chip">{movie.Genre}</span>
              </p>
              {movie.imdbRating !== 'N/A' && (
                <p className="movie-details-rating">⭐ {movie.imdbRating}/10 ({movie.imdbVotes} votes)</p>
              )}
              <p className="movie-details-plot">{movie.Plot}</p>
              <dl className="movie-details-list">
                <dt>Director</dt>
                <dd>{movie.Director}</dd>
                <dt>Actors</dt>
                <dd>{movie.Actors}</dd>
                <dt>Released</dt>
                <dd>{movie.Released}</dd>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}