import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async ({ name, email, password }) => {
    await register(name, email, password);
    navigate('/tickets');
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <AuthForm type="register" onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;