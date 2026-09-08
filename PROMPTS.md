# Prompts Used During Development

Chronological log of prompts given to the AI assistant (Claude) while building this app.

## 1. Project setup
> Initialize a new react application using Vite, React, TypeScript

Result: scaffolded via `npm create vite@latest -- --template react-ts`, dependencies installed.

## 2. Feature scope decision
> Firebase should be used for whatever fits a typical mentor demo

Result: decided on Firebase Auth (email/password) + Firestore for per-user favorites,
based on the mentor session slides (Movie App using React, OMDb, Firebase).

## 3. Movie search slice
> Implement movie search (OMDb) — types, API service with error handling,
> debounced search hook, search bar, results grid, and a details modal.
> TypeScript, real error/loading states, accessible markup.

Result: added:
- `src/types/movie.ts` — typed OMDb response shapes (OMDb returns "N/A" strings
  instead of null, so types reflect that instead of hiding it)
- `src/services/omdbApi.ts` — fetch wrapper with a custom `OmdbApiError`,
  since OMDb returns HTTP 200 even on errors (`Response: "False"` in the body)
- `src/hooks/useMovieSearch.ts` — debounced search with `AbortController` to
  cancel stale requests (race-condition protection)
- `src/components/SearchBar.tsx`, `MovieCard.tsx`, `MovieGrid.tsx`,
  `MovieDetailsModal.tsx`

## 4. Minimum search length validation
> I want the search query to work when at least containing two characters
> and throw an error message telling the user that when writing one letter
> or searching nothing

Result: updated `src/hooks/useMovieSearch.ts` to reject queries under 2
characters locally (no wasted API call) and surface a clear message —
covers both the empty box and single-character cases.

## 5. Favourites feature
> Add a feature where the user can click a favourite button on a movie
> and have it added to another page named Favourites

Result: added:
- `src/context/FavoritesContext.tsx` — favourites persisted to
  `localStorage`, exposed via a `useFavorites()` hook so the persistence
  mechanism is isolated from the UI (designed to swap to Firestore later
  without touching components)
- `src/pages/FavoritesPage.tsx` — the Favourites view
- Updated `MovieCard.tsx` (heart button, separate click target from the
  card so it doesn't also open the details modal), `MovieGrid.tsx`
  (wired to `useFavorites`), `App.tsx` (tab nav between Search/Favourites)

## 6. Firebase initialization
> Initialize Firebase using environment variables and export the database
> instance. Do not add authentication yet.

Result: installed the `firebase` package, added `src/services/firebase.ts`
— reads all config from `VITE_FIREBASE_*` env vars, warns (doesn't throw)
if any are missing so the OMDb-only features keep working, exports `db`
(Firestore instance) only. No auth wired up yet, as requested.
