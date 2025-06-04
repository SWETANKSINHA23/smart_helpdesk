import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import AuditTimeline from '../components/AuditTimeline';
import { toast } from 'react-toastify';

const TicketDetailPage = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [suggestion, setSuggestion] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const [ticketRes, suggestionRes, auditRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/tickets/${id}`),
                    axios.get(`${import.meta.env.VITE_API_URL}/agent/suggestion/${id}`),
                    axios.get(`${import.meta.env.VITE_API_URL}/tickets/${id}/audit`),
                ]);

                setTicket(ticketRes.data);
                setSuggestion(suggestionRes.data);
                setAuditLogs(auditRes.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch ticket details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicketDetails();
    }, [id]);

    if (isLoading) {
        return <div className="text-center mt-5"><LoadingSpinner /></div>;
    }

    if (!ticket) {
        return <p className="text-center text-muted mt-5">Ticket not found.</p>;
    }

    const { title, description, status, createdAt } = ticket;
    const formattedDate = new Date(createdAt).toLocaleString();
    
    return (
        <div className="card shadow-sm p-4">
            <div className="card-body">
                <h1 className="card-title h3">{title}</h1>
                <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className={`badge ${status === 'resolved' ? 'bg-success' : 'bg-secondary'}`}>
                        {status.replace('_', ' ')}
                    </span>
                    <span className="text-muted">Created: {formattedDate}</span>
                </div>
                
                <h5>Description</h5>
                <p className="card-text">{description}</p>

                {suggestion && (
                    <div className="card bg-light my-4">
                        <div className="card-body">
                            <h5 className="card-title text-primary">Agent's Suggestion</h5>
                            <p className="card-text">{suggestion.draftReply}</p>
                            <div className="small text-muted">
                                <p className="mb-0"><strong>Predicted Category:</strong> <span className="text-capitalize">{suggestion.predictedCategory}</span></p>
                                <p className="mb-0"><strong>Confidence Score:</strong> <span className="fw-bold">{suggestion.confidence.toFixed(2)}</span></p>
                                {suggestion.autoClosed && <p className="text-success fw-bold">This ticket was auto-closed.</p>}
                            </div>
                        </div>
                    </div>
                )}
                <AuditTimeline logs={auditLogs} />
            </div>
        </div>
    );
};

export default TicketDetailPage;