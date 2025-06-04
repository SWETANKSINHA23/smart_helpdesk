import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    await login(email, password);
    navigate('/tickets');
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;