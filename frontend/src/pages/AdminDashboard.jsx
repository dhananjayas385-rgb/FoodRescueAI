import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, CheckCircle, Users, Building, Utensils, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyOrg = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/verify`);
      alert("Organization account verified successfully!");
      fetchData();
    } catch (err) {
      alert("Failed to verify organization.");
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Admin Management Portal</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Platform metrics, organization verification, and moderation controls
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <Users size={16} /> Total Users
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem' }}>{stats.total_users || 0}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.85rem' }}>
            <Building size={16} /> Donors
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem' }}>{stats.total_donors || 0}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '0.85rem' }}>
            <Building size={16} /> Organizations
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem' }}>{stats.total_organizations || 0}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.85rem' }}>
            <Utensils size={16} /> Total Listings
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.3rem' }}>{stats.total_listings || 0}</div>
        </div>
      </div>

      {/* User Verification Table */}
      <h3 style={{ marginBottom: '1.25rem' }}>Registered Platform Accounts</h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading user directory...</div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.8rem 1rem' }}>User / Org Name</th>
                <th style={{ padding: '0.8rem 1rem' }}>Email</th>
                <th style={{ padding: '0.8rem 1rem' }}>Role</th>
                <th style={{ padding: '0.8rem 1rem' }}>Phone & Address</th>
                <th style={{ padding: '0.8rem 1rem' }}>Verification</th>
                <th style={{ padding: '0.8rem 1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700 }}>{u.full_name}</div>
                    {u.organization_name && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.organization_name}</div>}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: u.role === 'donor' ? 'rgba(16, 185, 129, 0.15)' : u.role === 'organization' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: u.role === 'donor' ? '#34d399' : u.role === 'organization' ? '#60a5fa' : '#fbbf24'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <div>{u.phone || 'N/A'}</div>
                    <div>{u.address || 'N/A'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {u.is_verified ? (
                      <span style={{ color: '#34d399', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={14} /> Verified
                      </span>
                    ) : (
                      <span style={{ color: '#f87171', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={14} /> Pending Approval
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {u.role === 'organization' && !u.is_verified && (
                      <button onClick={() => handleVerifyOrg(u.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        Approve NGO
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
