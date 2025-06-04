import React from 'react';
import { Link } from 'react-router-dom';

const statusColors = {
  open: 'badge bg-info text-dark',
  triaged: 'badge bg-warning text-dark',
  waiting_human: 'badge bg-primary',
  resolved: 'badge bg-success',
  closed: 'badge bg-secondary',
};

const TicketCard = ({ ticket }) => {
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title">{ticket.title}</h5>
          <span className={statusColors[ticket.status]}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>
        <p className="card-text text-muted flex-grow-1">{ticket.description.substring(0, 100)}...</p>
        <div className="d-flex justify-content-between text-sm text-muted">
          <span className="text-capitalize">Category: <strong>{ticket.category}</strong></span>
          <span>Created: {formattedDate}</span>
        </div>
        <Link to={`/tickets/${ticket._id}`} className="btn btn-outline-primary btn-sm mt-3">View Details</Link>
      </div>
    </div>
  );
};

export default TicketCard;