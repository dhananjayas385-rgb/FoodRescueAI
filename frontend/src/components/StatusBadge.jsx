import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toLowerCase();

  switch (normalized) {
    case 'available':
      return <span className="badge badge-available">Available</span>;
    case 'claimed':
      return <span className="badge badge-claimed">Claimed</span>;
    case 'completed':
      return <span className="badge badge-completed">Rescued</span>;
    case 'cancelled':
      return <span className="badge badge-cancelled">Cancelled</span>;
    default:
      return <span className="badge badge-secondary">{status}</span>;
  }
};

export default StatusBadge;
