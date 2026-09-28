import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, LogOut, User as UserIcon, Shield, Store, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      margin: '1rem 1.5rem',
      padding: '0.85rem 1.5rem',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: '1rem',
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
        }}>
          <HeartHandshake size={24} color="#ffffff" />
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            FoodRescue <span className="gradient-text">AI</span>
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Home
        </Link>

        {user ? (
          <>
            {user.role === 'donor' && (
              <Link to="/donor-dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <LayoutDashboard size={16} /> My Food Listings
              </Link>
            )}

            {user.role === 'organization' && (
              <Link to="/org-dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <Store size={16} /> Food Marketplace
              </Link>
            )}

            {user.role === 'admin' && (
              <Link to="/admin-dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <Shield size={16} /> Admin Portal
              </Link>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)'
            }}>
              <UserIcon size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.full_name}</span>
              <span style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                background: user.role === 'donor' ? 'rgba(16, 185, 129, 0.2)' : user.role === 'organization' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: user.role === 'donor' ? '#34d399' : user.role === 'organization' ? '#60a5fa' : '#fbbf24',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase',
                fontWeight: 700
              }}>
                {user.role}
              </span>
            </div>

            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.875rem' }}>
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.875rem' }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
