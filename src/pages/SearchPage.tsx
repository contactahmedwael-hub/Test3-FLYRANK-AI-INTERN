import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { MovieGrid } from '../components/MovieGrid';
import { useMovieSearch } from '../hooks/useMovieSearch';

interface SearchPageProps {
  onSelect: (imdbID: string) => void;
  onRequireLogin: () => void;
}

export function SearchPage({ onSelect, onRequireLogin }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const { results, isLoading, error } = useMovieSearch(query);

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <MovieGrid
        results={results}
        isLoading={isLoading}
        error={error}
        hasSearched={query.trim().length > 0}
        onSelect={onSelect}
        onRequireLogin={onRequireLogin}
      />
    </>
  );
}