import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Briefcase } from 'lucide-react';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const { data } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      login(data);
      navigate('/app/dashboard');
    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              Join the <span className="text-gradient">future</span> of work.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}
            >
              Create an account and start applying to the most exciting internships worldwide.
            </motion.p>
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              src="/login-illustration.png" 
              alt="Signup Illustration" 
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
            style={{ maxWidth: '480px' }}
          >
            <div className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="p-2 rounded-3 me-3" style={{ background: 'var(--gradient-brand)' }}>
                  <UserPlus size={24} color="#fff" />
                </div>
                <h4 className="fw-bold m-0" style={{ color: 'var(--text-primary)' }}>InternSync</h4>
              </div>
              <h2 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Create account</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Sign up for free and start your career.</p>
            </div>

            {error && <Alert variant="danger" className="rounded-3 border-0 py-2" style={{ fontSize: '0.9rem' }}>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>Full Name</Form.Label>
                <div className="position-relative">
                  <User size={16} className="position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ paddingLeft: '40px', height: '45px' }}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>Email</Form.Label>
                <div className="position-relative">
                  <Mail size={16} className="position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ paddingLeft: '40px', height: '45px' }}
                  />
                </div>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>Password</Form.Label>
                    <div className="position-relative">
                      <Lock size={16} className="position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Min 6 chars"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '40px', height: '45px' }}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>Confirm</Form.Label>
                    <div className="position-relative">
                      <Lock size={16} className="position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Repeat"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '40px', height: '45px' }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>I am a</Form.Label>
                <div className="position-relative">
                  <Briefcase size={16} className="position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{ paddingLeft: '40px', height: '45px' }}
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="company">Company</option>
                  </Form.Select>
                </div>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 fw-semibold mt-2"
                disabled={loading}
                style={{ height: '45px' }}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Create Account'}
              </Button>
            </Form>

            <p className="text-center mt-5 mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" className="fw-bold text-decoration-none" style={{ color: 'var(--text-primary)' }}>
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
