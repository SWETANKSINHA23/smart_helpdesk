import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TicketListPage from './pages/TicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import KBCreatePage from './pages/KBCreatePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TicketCreatePage from './pages/TicketCreatePage'; // Make sure this page exists

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className="container my-5 flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/tickets" element={
            <ProtectedRoute roles={['user', 'agent', 'admin']}>
              <TicketListPage />
            </ProtectedRoute>
          } />

          <Route path="/tickets/create" element={
            <ProtectedRoute roles={['user', 'agent', 'admin']}>
              <TicketCreatePage />
            </ProtectedRoute>
          } />

          <Route path="/tickets/:id" element={
            <ProtectedRoute roles={['user', 'agent', 'admin']}>
              <TicketDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/kb/create" element={
            <ProtectedRoute roles={['admin']}>
              <KBCreatePage />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={
            <div className="text-center mt-5">
              <h1 className="display-4 text-danger">404 - Not Found</h1>
              <p className="lead mt-3">The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;