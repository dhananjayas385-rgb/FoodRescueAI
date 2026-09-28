import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Sparkles, Clock, MapPin, CheckCircle, XCircle, Utensils, AlertCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const DonorDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [foodType, setFoodType] = useState('Cooked Meal');
  const [quantity, setQuantity] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [pickupDeadline, setPickupDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const fetchMyListings = async () => {
    try {
      const res = await api.get('/listings/my-listings');
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch donor listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/listings', {
        title,
        food_type: foodType,
        quantity,
        preparation_time: prepTime,
        pickup_deadline: pickupDeadline,
        location,
        description
      });

      setShowModal(false);
      resetForm();
      fetchMyListings();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create listing.');
    }
  };

  const handleAiAssessFreshness = async () => {
    if (!foodType || !prepTime) {
      alert("Please select a Food Type and enter Preparation Time first.");
      return;
    }
    setAiLoading(true);
    setAiAdvice('');

    try {
      const res = await api.post('/ai/assess-freshness', {
        food_type: foodType,
        quantity: quantity || "10 servings",
        preparation_time: prepTime,
        storage_condition: "Room Temperature"
      });

      setAiAdvice(`AI Safety Tip: ${res.data.food_safety_advice} (Suggested pickup window: ${res.data.suggested_pickup_window_hours} hours)`);
      if (!pickupDeadline) {
        setPickupDeadline(`Within ${res.data.suggested_pickup_window_hours} hours`);
      }
    } catch (err) {
      console.error("AI assessment failed", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleStatusUpdate = async (listingId, newStatus) => {
    try {
      await api.put(`/listings/${listingId}/status`, { status: newStatus });
      fetchMyListings();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update status.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setFoodType('Cooked Meal');
    setQuantity('');
    setPrepTime('');
    setPickupDeadline('');
    setLocation('');
    setDescription('');
    setAiAdvice('');
  };

  const activeCount = listings.filter(l => l.status === 'available').length;
  const claimedCount = listings.filter(l => l.status === 'claimed').length;
  const rescuedCount = listings.filter(l => l.status === 'completed').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Donor Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Manage your surplus food donations and track collection status
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={20} /> Create Food Listing
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Available</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>{activeCount}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Claimed by NGOs</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60a5fa', marginTop: '0.25rem' }}>{claimedCount}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Successfully Rescued</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.25rem' }}>{rescuedCount}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Posted</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>{listings.length}</div>
        </div>
      </div>

      {/* Listings List */}
      <h3 style={{ marginBottom: '1.25rem' }}>Your Surplus Food Listings</h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Utensils size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h4>No food listings created yet</h4>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Got surplus prepared meals or fresh ingredients? Post a listing to connect with local charities.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} /> Create Your First Listing
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {listings.map((item) => (
            <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.title}</h4>
                  <StatusBadge status={item.status} />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
                    📦 {item.quantity}
                  </span>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
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
                  {item.claimed_by_org && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', color: '#60a5fa' }}>
                      🤝 Claimed by: <strong>{item.claimed_by_org.organization_name || item.claimed_by_org.full_name}</strong> ({item.claimed_by_org.phone || 'No phone'})
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                {item.status === 'claimed' && (
                  <button onClick={() => handleStatusUpdate(item.id, 'completed')} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>
                    <CheckCircle size={16} /> Mark Rescued
                  </button>
                )}
                {item.status === 'available' && (
                  <button onClick={() => handleStatusUpdate(item.id, 'cancelled')} className="btn btn-danger" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>
                    <XCircle size={16} /> Cancel Listing
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="glass-panel modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Create Surplus Food Listing</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreateListing}>
              <div className="form-group">
                <label className="form-label">Food Title / Brief Description</label>
                <input type="text" required className="form-input" placeholder="e.g. 50 Servings of Fresh Catered Rice & Buffet Meals" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Food Category</label>
                  <select className="form-select" value={foodType} onChange={(e) => setFoodType(e.target.value)}>
                    <option value="Cooked Meal">Cooked Meal</option>
                    <option value="Bakery">Bakery & Bread</option>
                    <option value="Produce">Fresh Fruits & Vegetables</option>
                    <option value="Packaged">Packaged Goods</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input type="text" required className="form-input" placeholder="e.g. 15 kg or 40 boxes" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Preparation Time</label>
                  <input type="text" required className="form-input" placeholder="e.g. Today 2:00 PM" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Pickup Deadline</label>
                  <input type="text" required className="form-input" placeholder="e.g. Today 8:00 PM" value={pickupDeadline} onChange={(e) => setPickupDeadline(e.target.value)} />
                </div>
              </div>

              {/* AI Freshness Advisor Button */}
              <div style={{ marginBottom: '1.25rem' }}>
                <button type="button" onClick={handleAiAssessFreshness} className="btn btn-outline-primary" style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }} disabled={aiLoading}>
                  <Sparkles size={16} /> {aiLoading ? 'Asking AI Freshness Advisor...' : 'Use AI to Estimate Safe Pickup Window & Safety Advice'}
                </button>
                {aiAdvice && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', color: '#34d399', fontSize: '0.85rem' }}>
                    {aiAdvice}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Address / Location</label>
                <input type="text" required className="form-input" placeholder="e.g. 123 Hotel Blvd, Rear Loading Dock #2" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Instructions / Dietary Notes</label>
                <textarea className="form-textarea" rows="3" placeholder="e.g. Contains vegetarian options. Packaged in disposable trays." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
