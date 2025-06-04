import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const TicketCreatePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tickets`, {
        title,
        description,
      });
      toast.success('Ticket created successfully! An agent will review it shortly.');
      navigate('/tickets');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to create ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mx-auto p-4" style={{ maxWidth: '600px' }}>
      <div className="card-body">
        <h1 className="card-title text-primary mb-4">Create New Ticket</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketCreatePage;