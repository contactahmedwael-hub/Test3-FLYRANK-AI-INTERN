# Prompts Used During Development

Chronological log of the work done with the AI assistant (Claude) while building this app.

## 1. Project setup

Result: scaffolded via `npm create vite@latest -- --template react-ts`, dependencies installed.

## 2. Feature scope decision

Result: decided on Firebase Auth (email/password) + a database for per-user favourites,
based on the mentor session slides (Movie App using React, OMDb, Firebase).

## 3. Movie search slice

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

Result: updated `src/hooks/useMovieSearch.ts` to reject queries under 2
characters locally (no wasted API call) and surface a clear message —
covers both the empty box and single-character cases.

## 5. Favourites feature

Result: added:
- `src/context/FavoritesContext.tsx` — favourites persisted to
  `localStorage`, exposed via a `useFavorites()` hook so the persistence
  mechanism is isolated from the UI (designed to swap to a real database
  later without touching components)
- `src/pages/FavoritesPage.tsx` — the Favourites view
- Updated `MovieCard.tsx` (heart button, separate click target from the
  card so it doesn't also open the details modal), `MovieGrid.tsx`
  (wired to `useFavorites`), `App.tsx` (tab nav between Search/Favourites)

## 6. Firebase initialization

Result: installed the `firebase` package, added `src/services/firebase.ts`
— reads all config from `VITE_FIREBASE_*` env vars, warns (doesn't throw)
if any are missing so the OMDb-only features keep working, exports `db`
(Firestore instance) only. No auth wired up yet, as requested.

## 7. Switch to Realtime Database

Result: removed `localStorage` from `FavoritesContext.tsx` entirely.
Rewrote `firebase.ts` to use `getDatabase` instead of `getFirestore`.
`FavoritesContext` now live-subscribes to a database node with `onValue`
and writes with `set`/`remove`. Also caught and fixed a stale-build issue
where the old `localStorage`-based code was still running in the browser
after the file swap — the fix was a full clean re-extract, not a code
change.

## 8. Firebase Auth + Firestore, explicit MVVM structure

Spec covered: `getAuth`/`getFirestore` from env vars, modern modular SDK;
`createUserWithEmailAndPassword` / `signInWithEmailAndPassword` /
`signOut` / `onAuthStateChanged` (wrapped in `subscribeToAuthChanges`);
typed user data; readable Firebase errors; no React hooks/JSX in that
layer. MVVM file structure: `AuthModel.ts`, `useAuthViewModel.ts`,
`AuthView.tsx` — `AuthModel` imports from `authService` and exports
`register`/`login`/`logout`; the view-model manages `email`, `password`,
`mode`, `loading`, `error` via `useState`, with `handleSubmit` and
`toggleMode` (named to match the `mode` state — flagged before building).

Result: this conflicted with an earlier request to add `db` as Firestore,
since `db` was already the Realtime Database export from step 6 — flagged
it and got confirmation to keep Realtime Database for favourites (renamed
its export to `rtdb`) and add Firestore as a separate, currently-unused
`db` export alongside the new `auth` export. Added:
- `src/services/authService.ts` — pure Firebase Auth wrapper, no
  hooks/JSX, typed `AuthUser`, maps Firebase error codes to readable
  messages
- `src/pages/Auth/AuthModel.ts`, `useAuthViewModel.ts`, `AuthView.tsx`
- Updated `firebase.ts` (`auth`/`db`/`rtdb` exports) and
  `FavoritesContext.tsx` (import renamed to `rtdb`)

## 9. Gate Favourites behind login

Result: added `src/context/AuthContext.tsx` (shared `useAuth()` — auth
tracking pulled out of `App.tsx` so more than one component can use it).
`App.tsx` now shows `AuthView` instead of `FavoritesPage` when logged out.

## 10. Gate the heart-button click too, not just the tab

Result: `MovieGrid.tsx` now reads `useAuth()` and checks `currentUser`
before calling `toggleFavorite` — if logged out, it calls a new
`onRequireLogin` prop instead of writing to the database. `App.tsx` wires
that prop to switch to the Favourites view (which shows the login form).

## 11. Reset favourites count on logout + fix empty-search messaging

Result: `FavoritesContext.tsx`'s database subscription now depends on
`currentUser` — clears favourites immediately on logout, re-subscribes
and reloads on login. `useMovieSearch.ts` now treats an empty query as
`error: null` (falls through to the neutral "start typing" prompt) and
only shows the length error for exactly one character.

## 12. Per-user favourites path

Result: moved the favourites path in `FavoritesContext.tsx` from a
shared top-level `/favorites` node to `/users/{uid}/favourites`, scoped
to whoever's logged in. Noted the old shared node is now dead data and
suggested updated security rules to enforce the per-uid boundary
server-side, not just client-side.

## 13. Visual redesign + favicon/title

Result: followed a plan → critique → build process rather than jumping
to code. Concept: a cinema marquee at night — deep indigo gradient
background, warm gold as the single accent, Bebas Neue spent only on
the site title/page headings (Inter everywhere else), underline nav tabs
instead of pill buttons, a ticket-perforation divider on movie cards, and
type/rating shown as chips instead of "A · B · C" middot strings (a
generic AI-design tell to avoid). Updated `index.html` (title, Google
Fonts), replaced `public/favicon.svg` with a custom clapperboard mark,
removed the unused leftover `public/icons.svg`, rewrote `App.css`, and
touched `MovieCard.tsx`/`MovieDetailsModal.tsx` to swap middot strings
for chip elements.

## 14. React Router + 404 page

Result: installed `react-router-dom`, wrapped the app in `BrowserRouter`
(`main.tsx`). Extracted `SearchPage.tsx` (it had been inlined in
`App.tsx` since step 3, inconsistent with `FavoritesPage` already having
its own file) and `FavoritesGate.tsx` (the login-check logic, pulled out
of `App.tsx`). Added `NotFoundPage.tsx` for unmatched routes.
`App.tsx`'s tab `useState` became real `<Routes>`/`<NavLink>` — the URL
now reflects the current page.
