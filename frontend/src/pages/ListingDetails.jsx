import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Clock, MapPin, Building, ArrowLeft } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Failed to load listing", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading listing...</div>;
  if (!listing) return <div style={{ textAlign: 'center', padding: '4rem' }}>Listing not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h2>{listing.title}</h2>
          <StatusBadge status={listing.status} />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <span className="badge badge-claimed">{listing.food_type}</span>
          <span className="badge badge-available">{listing.quantity}</span>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
          {listing.description || 'No additional details specified.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255, 255, 255, 0.04)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--primary)" /> <strong>Preparation Time:</strong> {listing.preparation_time}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#f43f5e" /> <strong>Pickup Deadline:</strong> {listing.pickup_deadline}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="#60a5fa" /> <strong>Address Location:</strong> {listing.location}
          </div>
          {listing.donor && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} color="#fbbf24" /> <strong>Donor Establishment:</strong> {listing.donor.organization_name || listing.donor.full_name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
