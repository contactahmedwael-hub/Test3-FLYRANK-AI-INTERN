/**
 * Shapes returned by the OMDb API.
 * OMDb sends every field as a string (even numbers/ratings), and uses
 * the literal string "N/A" instead of null for missing values — the
 * types below reflect that rather than pretending it's a clean API.
 */

/** A single result row from the search endpoint (s=...). */
export interface MovieSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string; // URL, or the literal "N/A" if no poster exists
}

export interface SearchResponseSuccess {
  Search: MovieSearchResult[];
  totalResults: string;
  Response: 'True';
}

export interface SearchResponseError {
  Response: 'False';
  Error: string;
}

export type SearchResponse = SearchResponseSuccess | SearchResponseError;

/** A single rating entry (IMDb, Rotten Tomatoes, Metacritic, ...). */
export interface Rating {
  Source: string;
  Value: string;
}

/** Full detail payload from the by-ID endpoint (i=...). */
export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons?: string;
  Response: 'True' | 'False';
  Error?: string;
}
