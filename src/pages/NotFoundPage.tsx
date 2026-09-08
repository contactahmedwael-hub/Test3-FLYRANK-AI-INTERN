import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <h2 className="page-heading">404</h2>
      <p className="status-message">This page doesn't exist. Let's get you back to the movies.</p>
      <Link to="/" className="not-found-link">
        Back to Search
      </Link>
    </div>
  );
}