import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user, updateProfile, error, clearError, loading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErr, setValidationErr] = useState('');

  useEffect(() => {
    clearError();
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setValidationErr('');
    setSuccessMsg('');

    if (!username || !email) {
      setValidationErr('Username and Email are required.');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setValidationErr('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationErr('Passwords do not match.');
        return;
      }
    }

    const result = await updateProfile(username, email, password || null);
    if (result.success) {
      setSuccessMsg('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setValidationErr(result.message || 'Failed to update profile.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-card glass-panel" style={{ marginTop: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>User Profile</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>View and update your account details</p>
          </div>

          {validationErr && <div className="alert alert-danger">{validationErr}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          {user && (
            <div className="profile-details-grid">
              <div className="profile-item">
                <label>Username</label>
                <p>{user.username}</p>
              </div>
              <div className="profile-item">
                <label>Email Address</label>
                <p>{user.email}</p>
              </div>
              <div className="profile-item">
                <label>Account Created</label>
                <p>{formatDate(user.createdAt)}</p>
              </div>
              <div className="profile-item">
                <label>Session Expiry</label>
                <p>7 Days</p>
              </div>
            </div>
          )}

          <form onSubmit={handleUpdate} className="auth-form">
            <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
              Update Profile Information
            </h3>

            <div className="form-group">
              <label htmlFor="update-username">Username</label>
              <input
                id="update-username"
                type="text"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="update-email">Email Address</label>
              <input
                id="update-email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="update-password">New Password (Leave blank to keep current)</label>
              <input
                id="update-password"
                type="password"
                className="input-field"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {password && (
              <div className="form-group">
                <label htmlFor="update-confirm-password">Confirm New Password</label>
                <input
                  id="update-confirm-password"
                  type="password"
                  className="input-field"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Updating Details...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
