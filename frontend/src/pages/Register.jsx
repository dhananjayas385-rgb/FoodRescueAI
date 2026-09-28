import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Building, HeartHandshake, AlertCircle } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('donor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newUser = await register({
        full_name: fullName,
        email,
        password,
        role,
        organization_name: organizationName || fullName,
        phone,
        address
      });

      if (newUser.role === 'donor') {
        navigate('/donor-dashboard');
      } else if (newUser.role === 'organization') {
        navigate('/org-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '2rem auto', padding: '0 1rem 3rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)'
          }}>
            <UserPlus size={28} />
          </div>
          <h2>Create Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Join the FoodRescue AI network today
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`glass-panel-interactive`}
            style={{
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer',
              borderColor: role === 'donor' ? 'var(--primary)' : 'var(--border)',
              background: role === 'donor' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.5)'
            }}
          >
            <Building size={24} color={role === 'donor' ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.4rem auto', display: 'block' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: role === 'donor' ? '#ffffff' : 'var(--text-secondary)' }}>
              Food Donor
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Restaurant / Hotel / Host</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('organization')}
            className={`glass-panel-interactive`}
            style={{
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer',
              borderColor: role === 'organization' ? '#3b82f6' : 'var(--border)',
              background: role === 'organization' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(15, 23, 42, 0.5)'
            }}
          >
            <HeartHandshake size={24} color={role === 'organization' ? '#60a5fa' : 'var(--text-muted)'} style={{ margin: '0 auto 0.4rem auto', display: 'block' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: role === 'organization' ? '#ffffff' : 'var(--text-secondary)' }}>
              Recipient NGO
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shelter / Charity / Food Bank</div>
          </button>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{role === 'donor' ? 'Establishment / Hotel Name' : 'Organization / Shelter Name'}</label>
            <input
              type="text"
              className="form-input"
              placeholder={role === 'donor' ? 'Grand Plaza Hotel' : 'Hope Community Shelter'}
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="contact@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / City</label>
              <input
                type="text"
                className="form-input"
                placeholder="Downtown Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'donor' ? 'Food Donor' : 'Organization'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
