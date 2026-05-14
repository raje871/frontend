import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await forgotPassword(email);
      setMessage('Password reset instructions have been sent to your email.');
      setSubmitted(true);
      // In this demo, we'll log the token since we don't have real email
      if (data.resetToken) {
        console.log('Reset Token:', data.resetToken);
        setMessage(`Password reset instructions sent! (Demo Token: ${data.resetToken})`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split-layout">
        <div className="auth-side-panel d-none d-lg-flex">
          <div className="auth-side-content">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="fw-bold mb-3" 
              style={{ color: 'var(--text-primary)', fontSize: '2.5rem' }}
            >
              Secure your <span className="text-gradient">account</span>.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}
            >
              Don't worry! It happens to the best of us. Let's get you back into your account.
            </motion.p>
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              src="/login-illustration.png" 
              alt="Forgot Password Illustration" 
              className="auth-side-image"
            />
          </div>
          
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', zIndex: 1 }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', zIndex: 1 }}></div>
        </div>

        <div className="auth-form-panel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="auth-card"
          >
            <div className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="p-2 rounded-3 me-3" style={{ background: 'var(--gradient-brand)' }}>
                  <KeyRound size={24} color="#fff" />
                </div>
                <h4 className="fw-bold m-0" style={{ color: 'var(--text-primary)' }}>InternSync</h4>
              </div>
              <h2 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Forgot Password?</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Enter your email and we'll send you reset instructions.</p>
            </div>

            {error && <Alert variant="danger" className="rounded-3 border-0 py-2" style={{ fontSize: '0.9rem' }}>{error}</Alert>}
            {message && <Alert variant="success" className="rounded-3 border-0 py-2" style={{ fontSize: '0.9rem' }}>{message}</Alert>}

            {!submitted ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>Email Address</Form.Label>
                  <div className="position-relative">
                    <Mail size={16} className="position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ paddingLeft: '40px', height: '45px' }}
                    />
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 fw-semibold mt-2"
                  disabled={loading}
                  style={{ height: '45px' }}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Send Reset Link'}
                </Button>
              </Form>
            ) : (
              <div className="text-center py-4">
                <p style={{ color: 'var(--text-secondary)' }}>
                  Check your inbox for further instructions.
                </p>
              </div>
            )}

            <div className="text-center mt-5">
              <Link to="/login" className="text-decoration-none d-inline-flex align-items-center fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <ArrowLeft size={16} className="me-2" />
                Back to Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
