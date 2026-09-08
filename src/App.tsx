import { useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { SearchPage } from './pages/SearchPage';
import { FavoritesGate } from './pages/FavouritesGate';
import { NotFoundPage } from './pages/NotFoundPage';
import { logout } from './pages/Auth/AuthModel';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import './App.css';

function navTabClass({ isActive }: { isActive: boolean }): string {
  return `nav-tab${isActive ? ' is-active' : ''}`;
}

function AppContent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { favorites } = useFavorites();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Clicking a heart while logged out routes to /favourites, which shows
  // the login screen for anyone not authenticated.
  function requireLogin() {
    navigate('/favourites');
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 Movie Explorer</h1>
        <p className="app-subtitle">Search movies and shows powered by OMDb</p>

        <nav className="app-nav" aria-label="Main">
          <NavLink to="/" end className={navTabClass}>
            Search
          </NavLink>
          <NavLink to="/favourites" className={navTabClass}>
            Favourites {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
          </NavLink>
        </nav>

        {currentUser && (
          <p className="auth-status">
            Signed in as {currentUser.email}{' '}
            <button type="button" className="auth-toggle" onClick={() => logout()}>
              Log out
            </button>
          </p>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<SearchPage onSelect={setSelectedId} onRequireLogin={requireLogin} />} />
          <Route path="/favourites" element={<FavoritesGate onSelect={setSelectedId} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {selectedId && (
        <MovieDetailsModal imdbID={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;