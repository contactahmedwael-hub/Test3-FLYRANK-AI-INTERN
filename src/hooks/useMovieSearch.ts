import { useEffect, useRef, useState } from 'react';
import { OmdbApiError, searchMovies } from '../services/omdbApi';
import type { MovieSearchResult } from '../types/movie';

interface UseMovieSearchState {
  results: MovieSearchResult[];
  totalResults: number;
  isLoading: boolean;
  error: string | null;
}

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

/**
 * Debounced OMDb search. Handles four edge cases the naive version
 * (fetch on every keystroke) gets wrong:
 *  1. Doesn't spam the API on every keystroke (debounced).
 *  2. Cancels the in-flight request when the query changes again, so a
 *     slow earlier response can't overwrite a newer one (race condition).
 *  3. Cleans up on unmount so it never calls setState on an unmounted component.
 *  4. Rejects a 1-character query locally with a clear message (an
 *     empty box just falls through to the "start typing" prompt instead
 *     of showing an error).
 */
export function useMovieSearch(query: string): UseMovieSearchState {
  const [state, setState] = useState<UseMovieSearchState>({
    results: [],
    totalResults: 0,
    isLoading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    // Cancel whatever was previously in flight (debounce timer or fetch).
    abortRef.current?.abort();

    if (trimmed.length === 0) {
      // Nothing typed yet — not an error, just the initial/cleared state.
      // MovieGrid shows its own "start typing" prompt for this case.
      setState({ results: [], totalResults: 0, isLoading: false, error: null });
      return;
    }

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setState({
        results: [],
        totalResults: 0,
        isLoading: false,
        error: `Please enter at least ${MIN_QUERY_LENGTH} characters to search.`,
      });
      return;
    }

    const timer = setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      searchMovies(trimmed, 1, controller.signal)
        .then((data) => {
          setState({
            results: data.Search,
            totalResults: Number(data.totalResults) || 0,
            isLoading: false,
            error: null,
          });
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          const message = err instanceof OmdbApiError ? err.message : 'Something went wrong while searching.';
          setState({ results: [], totalResults: 0, isLoading: false, error: message });
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query]);

  return state;
}