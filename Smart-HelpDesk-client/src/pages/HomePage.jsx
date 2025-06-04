import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center vh-100">
      <h1 className="display-4 fw-bold text-dark mb-3">Welcome to smart helpdesk</h1>
      <p className="lead text-muted mb-4" style={{ maxWidth: '600px' }}>
        Your intelligent support system powered by an agentic workflow to triage, classify, and resolve tickets efficiently.
      </p>
      <div className="d-grid gap-2 d-md-block">
        <Link to="/tickets" className="btn btn-primary btn-lg me-2">
          View Tickets
        </Link>
        <Link to="/register" className="btn btn-outline-primary btn-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;