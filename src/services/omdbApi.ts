import type { MovieDetails, SearchResponse, SearchResponseSuccess } from '../types/movie';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY as string | undefined;
const BASE_URL = import.meta.env.VITE_OMDB_BASE_URL ?? 'https://www.omdbapi.com/';

/**
 * OMDb quirk: it responds with HTTP 200 even for "no results" or "invalid
 * key" — errors show up as { Response: "False", Error: "..." } in the
 * body, not as a bad status code. This custom error class lets callers
 * tell that apart from a real network/HTTP failure.
 */
export class OmdbApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OmdbApiError';
  }
}

function assertApiKey(): void {
  if (!API_KEY) {
    throw new OmdbApiError(
      'Missing OMDb API key. Add VITE_OMDB_API_KEY to your .env file (see .env.example).'
    );
  }
}

/**
 * Search movies/series by title (OMDb's `s=` search endpoint).
 * Supports cancellation via AbortSignal so a fast typer's stale
 * requests don't overwrite the response to their latest keystroke.
 */
export async function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal
): Promise<SearchResponseSuccess> {
  assertApiKey();

  const trimmed = query.trim();
  if (!trimmed) {
    return { Search: [], totalResults: '0', Response: 'True' };
  }

  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(trimmed)}&page=${page}`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new OmdbApiError('Could not reach OMDb — check your internet connection and try again.');
  }

  if (!response.ok) {
    throw new OmdbApiError(`OMDb request failed (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as SearchResponse;

  if (data.Response === 'False') {
    // OMDb returns "Movie not found!" for empty results — treat that as
    // an empty list rather than an error the UI has to apologize for.
    if (data.Error.toLowerCase().includes('not found')) {
      return { Search: [], totalResults: '0', Response: 'True' };
    }
    throw new OmdbApiError(data.Error);
  }

  return data;
}

/** Fetch full details for one title by its IMDb ID (OMDb's `i=` endpoint). */
export async function getMovieDetails(
  imdbID: string,
  signal?: AbortSignal
): Promise<MovieDetails> {
  assertApiKey();

  const url = `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new OmdbApiError('Could not reach OMDb — check your internet connection and try again.');
  }

  if (!response.ok) {
    throw new OmdbApiError(`OMDb request failed (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as MovieDetails;

  if (data.Response === 'False') {
    throw new OmdbApiError(data.Error ?? 'Movie details not found.');
  }

  return data;
}
