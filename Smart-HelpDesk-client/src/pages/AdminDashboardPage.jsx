import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="text-center mt-5">
      <h1 className="h2 text-primary">Admin Dashboard</h1>
      <p className="lead text-muted">Manage KB articles and app configurations.</p>
      <div className="mt-4">
        <Link to="/kb/create" className="btn btn-primary me-2">
          Create New KB Article
        </Link>
        
        <p className="mt-3">
          <small className="text-muted">
            More features (like managing users or configurations) can be added here.
          </small>
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;