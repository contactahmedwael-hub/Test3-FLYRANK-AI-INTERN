import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onValue, ref, remove, set } from 'firebase/database';
import { rtdb } from '../services/firebase';
import { useAuth } from './AuthContext';
import type { MovieSearchResult } from '../types/movie';

interface FavoritesContextValue {
  favorites: MovieSearchResult[];
  isLoading: boolean;
  error: string | null;
  isFavorite: (imdbID: string) => boolean;
  toggleFavorite: (movie: MovieSearchResult) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/** Per-user favourites path: /users/{uid}/favourites */
function favoritesPathFor(uid: string): string {
  return `users/${uid}/favourites`;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<MovieSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Live-subscribe to /users/{uid}/favourites — scoped to whoever's
  // logged in. On logout the subscription is torn down and favourites
  // are cleared immediately; on login it subscribes to that user's own
  // node and loads their data.
  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    const favoritesRef = ref(rtdb, favoritesPathFor(currentUser.uid));

    const unsubscribe = onValue(
      favoritesRef,
      (snapshot) => {
        const value = snapshot.val() as Record<string, MovieSearchResult> | null;
        setFavorites(value ? Object.values(value) : []);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message || 'Could not load favourites from the database.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isLoading,
      error,
      isFavorite: (imdbID) => favorites.some((m) => m.imdbID === imdbID),
      toggleFavorite: (movie) => {
        if (!currentUser) {
          // MovieGrid already gates this behind login, but guard directly
          // here too rather than silently writing to nowhere.
          setError('You need to be logged in to save favourites.');
          return;
        }

        const movieRef = ref(rtdb, `${favoritesPathFor(currentUser.uid)}/${movie.imdbID}`);
        const alreadyFavorite = favorites.some((m) => m.imdbID === movie.imdbID);
        const write = alreadyFavorite ? remove(movieRef) : set(movieRef, movie);

        write.catch((err: unknown) => {
          setError(err instanceof Error ? err.message : 'Could not update favourites.');
        });
      },
    }),
    [favorites, currentUser, isLoading, error]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}