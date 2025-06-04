import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Header.css'; 

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully!');
    navigate('/login');
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light header-container">
      <div className="container-fluid container">
        <Link to="/" className="navbar-brand header-brand">smart helpdesk</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/tickets" className="nav-link header-nav-link">My Tickets</Link>
                </li>
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link to="/admin" className="nav-link header-nav-link">Admin Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/kb/create" className="nav-link header-nav-link">New KB Article</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <span className="nav-link text-muted">Welcome, {user.name}</span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-primary header-btn ms-lg-2">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link header-nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-primary header-btn ms-lg-2">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;