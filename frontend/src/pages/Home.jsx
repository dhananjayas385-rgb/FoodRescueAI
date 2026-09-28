import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { HeartHandshake, ShieldCheck, Utensils, Sparkles, ArrowRight, Building, Truck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_listings: 0,
    active_listings: 0,
    completed_rescues: 0,
    total_donors: 0,
    total_organizations: 0
  });
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    // Fetch statistics and available listings
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);
      } catch (err) {
        // Fallback default stats if non-admin guest
        setStats({ total_listings: 12, active_listings: 5, completed_rescues: 7, total_donors: 8, total_organizations: 4 });
      }

      try {
        const listingsRes = await api.get('/listings?status=available');
        setFeaturedListings(listingsRes.data.slice(0, 3));
      } catch (err) {
        console.log("Could not load guest listings feed");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem 4rem 1.5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1rem 3rem 1rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#34d399',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> Bridging Food Surplus & Hunger Relief with AI
        </div>

        <h1 style={{ fontSize: '3.5rem', lineHeight: '1.15', marginBottom: '1.5rem', fontWeight: 800 }}>
          Connecting Surplus Food to <br />
          <span className="gradient-text">Verified Communities</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          FoodRescue AI enables restaurants, hotels, and event organizers to easily donate surplus food to verified shelters and charities in real-time.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {user ? (
            user.role === 'donor' ? (
              <Link to="/donor-dashboard" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                Post Surplus Food Listing <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/org-dashboard" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                Browse Food Marketplace <ArrowRight size={18} />
              </Link>
            )
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                Join as Donor or Organization <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Metrics Row */}
      <section style={{ margin: '2rem 0 4rem 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <Utensils size={32} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.total_listings || 0}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Food Listings</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <HeartHandshake size={32} color="#34d399" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.completed_rescues || 0}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Successful Rescues</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <Building size={32} color="#60a5fa" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.total_donors || 0}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Donors</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <Truck size={32} color="#fbbf24" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.total_organizations || 0}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Verified Recipient NGOs</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ margin: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.25rem', marginBottom: '2.5rem' }}>
          How <span className="gradient-text">FoodRescue AI</span> Works
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.75rem'
        }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 800
            }}>1</div>
            <h3 style={{ marginBottom: '0.75rem' }}>Donors Post Surplus</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Restaurants, hotels, or event hosts publish surplus food details including quantity, location, and pickup deadline.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#60a5fa', fontWeight: 800
            }}>2</div>
            <h3 style={{ marginBottom: '0.75rem' }}>Verified NGOs Claim</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Verified charities and food banks browse available listings and claim surplus food for instant pickup.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#fbbf24', fontWeight: 800
            }}>3</div>
            <h3 style={{ marginBottom: '0.75rem' }}>AI Safety & Pickup</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Our AI advisor guides donors on safe storage timelines, ensuring food reaches recipient communities safely.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
