import type { MovieSearchResult } from '../types/movie';

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="445" viewBox="0 0 300 445">
      <rect width="300" height="445" fill="#1d1f38"/>
      <text x="50%" y="50%" fill="#9498bd" font-family="sans-serif" font-size="18" text-anchor="middle" dy=".3em">No Poster</text>
    </svg>`
  );

interface MovieCardProps {
  movie: MovieSearchResult;
  onSelect: (imdbID: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: MovieSearchResult) => void;
}

export function MovieCard({ movie, onSelect, isFavorite, onToggleFavorite }: MovieCardProps) {
  const posterSrc = movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER;

  return (
    <div className="movie-card">
      <button
        type="button"
        className="movie-card-main"
        onClick={() => onSelect(movie.imdbID)}
        aria-label={`View details for ${movie.Title} (${movie.Year})`}
      >
        <img
          src={posterSrc}
          alt=""
          className="movie-card-poster"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_POSTER;
          }}
        />
        <div className="movie-card-perforation" aria-hidden="true" />
        <div className="movie-card-body">
          <h3 className="movie-card-title">{movie.Title}</h3>
          <p className="movie-card-meta">
            <span>{movie.Year}</span>
            <span className="movie-card-type">{movie.Type}</span>
          </p>
        </div>
      </button>

      <button
        type="button"
        className={`favorite-button${isFavorite ? ' is-active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(movie);
        }}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${movie.Title} from favourites` : `Add ${movie.Title} to favourites`}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
    </div>
  );
}