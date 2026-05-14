import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';
import { resetPassword } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await resetPassword(token, formData.password);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'var(--gradient-brand)' }}>
            <ShieldCheck size={26} color="#fff" />
          </div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Set New Password</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Please enter your new password below</p>
        </div>

        {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
        {message && <Alert variant="success" className="rounded-3">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>New Password</Form.Label>
            <div className="position-relative">
              <Lock size={18} className="position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <Form.Control
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Confirm New Password</Form.Label>
            <div className="position-relative">
              <Lock size={18} className="position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-medium"
            disabled={loading || !!message}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
          </Button>
        </Form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
