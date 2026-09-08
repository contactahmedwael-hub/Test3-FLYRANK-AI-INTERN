interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="movie-search" className="visually-hidden">
        Search movies
      </label>
      <input
        id="movie-search"
        type="search"
        className="search-input"
        placeholder="Search for a movie or show..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}
