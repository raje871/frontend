import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation();
  const selectedRole = location.state?.selectedRole || '';
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const getRoleIcon = () => {
    switch(selectedRole) {
      case 'student': return <GraduationCap size={26} color="#fff" />;
      case 'mentor': return <Briefcase size={26} color="#fff" />;
      case 'coordinator': return <ShieldCheck size={26} color="#fff" />;
      default: return <LogIn size={26} color="#fff" />;
    }
  };

  const getRoleTitle = () => {
    if (!selectedRole) return 'Welcome back';
    return `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      login(data);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
              Start your <span className="text-gradient">journey</span> with InternSync.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}
            >
              The world's best internship platform for students and companies to connect and grow together.
            </motion.p>
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              src="/login-illustration.png" 
              alt="Login Illustration" 
              className="auth-side-image"
            />
          </div>
          
          {/* Decorative elements */}
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
                  {getRoleIcon()}
                </div>
                <h4 className="fw-bold m-0" style={{ color: 'var(--text-primary)' }}>InternSync</h4>
              </div>
              <h2 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>{getRoleTitle()}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Please enter your details.</p>
            </div>

            {error && <Alert variant="danger" className="rounded-3 border-0 py-2" style={{ fontSize: '0.9rem' }}>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
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

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>Password</Form.Label>
                <div className="position-relative">
                  <Lock size={16} className="position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ paddingLeft: '40px', height: '45px' }}
                  />
                </div>
                <div className="text-end mt-2">
                  <Link to="/forgot-password" style={{ color: 'var(--accent-indigo)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '500' }}>
                    Forgot password?
                  </Link>
                </div>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 fw-semibold mt-3"
                disabled={loading}
                style={{ height: '45px' }}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
              </Button>
            </Form>

            <p className="text-center mt-5 mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="fw-bold text-decoration-none" style={{ color: 'var(--text-primary)' }}>
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
