import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Store, Clock, MapPin, Phone, Building, CheckCircle, Search, Filter } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const OrgDashboard = () => {
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' or 'my-claims'
  const [listings, setListings] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      const res = await api.get('/listings?status=available');
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch available listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyClaims = async () => {
    try {
      const res = await api.get('/listings/my-listings');
      setMyClaims(res.data);
    } catch (err) {
      console.error("Failed to fetch claimed listings:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'marketplace') {
      fetchMarketplace();
    } else {
      fetchMyClaims();
    }
  }, [activeTab]);

  const handleClaimListing = async (listingId) => {
    try {
      await api.put(`/listings/${listingId}/claim`);
      alert("Success! You have claimed this surplus food listing. Please check 'My Claimed Food' for pickup details.");
      fetchMarketplace();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to claim food listing.");
    }
  };

  const handleMarkCompleted = async (listingId) => {
    try {
      await api.put(`/listings/${listingId}/status`, { status: 'completed' });
      alert("Thank you for completing this rescue!");
      fetchMyClaims();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update status.");
    }
  };

  const filteredListings = listings.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.food_type.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Organization Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Claim surplus food from local restaurants & hotels for community distribution
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="btn"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              background: activeTab === 'marketplace' ? 'var(--primary)' : 'transparent',
              color: '#ffffff'
            }}
          >
            <Store size={16} /> Available Marketplace
          </button>
          <button
            onClick={() => setActiveTab('my-claims')}
            className="btn"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              background: activeTab === 'my-claims' ? '#3b82f6' : 'transparent',
              color: '#ffffff'
            }}
          >
            <CheckCircle size={16} /> My Claimed Food
          </button>
        </div>
      </div>

      {activeTab === 'marketplace' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search food title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['All', 'Cooked Meal', 'Bakery', 'Produce', 'Packaged'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid',
                    cursor: 'pointer',
                    background: selectedCategory === cat ? 'var(--primary-light)' : 'rgba(255,255,255,0.04)',
                    borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border)',
                    color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Marketplace Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading surplus listings...</div>
          ) : filteredListings.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <h4>No surplus food available right now</h4>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Check back soon as local donors publish new listings.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {filteredListings.map((item) => (
                <div key={item.id} className="glass-panel-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.title}</h4>
                      <StatusBadge status={item.status} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-full)', color: '#34d399', fontWeight: 600 }}>
                        📦 {item.quantity}
                      </span>
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: 'var(--radius-full)', color: '#60a5fa', fontWeight: 600 }}>
                        🍲 {item.food_type}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                      {item.description || 'No additional details provided.'}
                    </p>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} color="var(--primary)" /> Pickup Deadline: <strong style={{ color: '#ffffff' }}>{item.pickup_deadline}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={14} color="#60a5fa" /> Location: {item.location}
                      </div>
                      {item.donor && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Building size={14} color="#fbbf24" /> Donor: {item.donor.organization_name || item.donor.full_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={() => handleClaimListing(item.id)} className="btn btn-primary" style={{ width: '100%' }}>
                    Claim Food Surplus
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* My Claimed Food Tab */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {myClaims.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
              <h4>No claimed food listings yet</h4>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Browse the marketplace tab to claim food for your organization.</p>
            </div>
          ) : (
            myClaims.map((item) => (
              <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.title}</h4>
                    <StatusBadge status={item.status} />
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {item.description}
                  </p>

                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>Pickup Instructions</div>
                    <div>📍 <strong>Address:</strong> {item.location}</div>
                    <div>⏰ <strong>Deadline:</strong> {item.pickup_deadline}</div>
                    {item.donor && (
                      <div>📞 <strong>Donor Contact:</strong> {item.donor.full_name} ({item.donor.phone || 'No phone listed'})</div>
                    )}
                  </div>
                </div>

                {item.status === 'claimed' && (
                  <button onClick={() => handleMarkCompleted(item.id)} className="btn btn-primary" style={{ width: '100%' }}>
                    <CheckCircle size={16} /> Confirm Pickup Completed
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrgDashboard;
