import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TicketCard from '../components/TicketCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TicketListPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTickets = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/tickets`);
          setTickets(res.data);
          setIsLoading(false);
        } catch (error) {
          toast.error('Failed to fetch tickets.');
          setIsLoading(false);
        }
      };
      fetchTickets();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div className="text-center mt-5"><LoadingSpinner /></div>;
  }
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Tickets</h1>
        <Link to="/tickets/create" className="btn btn-primary">
          Create New Ticket
        </Link>
      </div>
      {tickets.length === 0 ? (
        <p className="text-center text-muted mt-5">You don't have any tickets yet. Why not create one?</p>
      ) : (
        <div className="row g-3">
          {tickets.map((ticket) => (
            <div className="col-md-6 col-lg-4" key={ticket._id}>
              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketListPage;