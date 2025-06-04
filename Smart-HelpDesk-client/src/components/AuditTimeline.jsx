import React from 'react';

const AuditTimeline = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return <p className="text-muted text-center mt-4">No audit log available for this ticket.</p>;
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h3 className="card-title">Audit Timeline</h3>
        <div className="list-group list-group-flush">
          {logs.map((log) => (
            <div key={log._id} className="list-group-item d-flex flex-column">
              <div className="d-flex w-100 justify-content-between">
                <span className="fw-bold text-uppercase">{log.action.replace(/_/g, ' ')}</span>
                <small className="text-muted">{new Date(log.timestamp).toLocaleString()}</small>
              </div>
              <p className="mb-1 text-muted">Actor: <span className="text-capitalize">{log.actor}</span></p>
              {log.meta && (
                <pre className="mt-2 p-2 bg-light rounded-2 small text-wrap">
                  <code>{JSON.stringify(log.meta, null, 2)}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditTimeline;