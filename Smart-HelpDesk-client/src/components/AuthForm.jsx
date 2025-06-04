import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';

const AuthForm = ({ type, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ name, email, password });
    } catch (error) {
      toast.error(error.response?.data?.msg || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isRegister = type === 'register';

  return (
    <div className="card shadow-lg mx-auto" style={{ maxWidth: '400px' }}>
      <div className="card-body p-4">
        <h2 className="card-title text-center text-primary mb-4">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegister}
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>
        <p className="mt-3 text-center text-muted">
          {isRegister ? (
            <>Already have an account? <Link to="/login" className="text-primary">Login</Link></>
          ) : (
            <>Don't have an account? <Link to="/register" className="text-primary">Register</Link></>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;