import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Navbar, Nav } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  Mail, 
  Info, 
  Home as HomeIcon
} from 'lucide-react';

const Home = () => {
  const [view, setView] = useState('hero'); // 'hero' or 'login-selection'
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setView('login-selection');
  };

  const handleRoleSelect = (role) => {
    // Navigate to login with role hint or just to general login
    navigate('/login', { state: { selectedRole: role } });
  };

  const loginRoles = [
    {
      id: 'student',
      title: 'Student Login',
      icon: <GraduationCap size={40} />,
      color: '#6366f1',
      desc: 'Access your internship portal, apply for roles, and track your progress.',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    },
    {
      id: 'mentor',
      title: 'Mentor Login',
      icon: <Briefcase size={40} />,
      color: '#10b981',
      desc: 'Guide students, review assignments, and provide feedback on their journey.',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      id: 'coordinator',
      title: 'Coordinator Login',
      icon: <ShieldCheck size={40} />,
      color: '#f59e0b',
      desc: 'Manage the internship ecosystem, approve postings, and monitor system stats.',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  ];

  return (
    <div className="home-wrapper" style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navigation Bar */}
      <Navbar expand="lg" className="px-4 py-3 sticky-top bg-white border-bottom shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <div className="rounded-circle d-flex justify-content-center align-items-center" 
                 style={{ background: 'var(--gradient-brand)', width: '36px', height: '36px', color: 'white', fontWeight: 'bold' }}>
              IS
            </div>
            <h4 className="m-0 fw-bold text-gradient">InternSync</h4>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-3 fw-medium">
              <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-1">
                <HomeIcon size={18} /> Home
              </Nav.Link>
              <Nav.Link href="#about" className="d-flex align-items-center gap-1">
                <Info size={18} /> About
              </Nav.Link>
              <Nav.Link href="#contact" className="d-flex align-items-center gap-1">
                <Mail size={18} /> Contact
              </Nav.Link>
            </Nav>
            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                className="rounded-pill px-4 py-2 shadow-sm fw-bold btn-primary"
                onClick={handleLoginClick}
              >
                Login
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>
        <AnimatePresence mode="wait">
          {view === 'hero' ? (
            <motion.section
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="hero-section py-5 position-relative overflow-hidden"
              style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}
            >
              {/* Background Shapes */}
              <div className="position-absolute" style={{ top: '-10%', right: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }}></div>
              <div className="position-absolute" style={{ bottom: '10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }}></div>

              <Container className="position-relative" style={{ zIndex: 1 }}>
                <Row className="align-items-center g-5">
                  <Col lg={7}>
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 mb-4 fw-semibold border border-primary border-opacity-10">
                        ✨ Next-Gen Internship Management
                      </span>
                      <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: '-1.5px', lineHeight: '1.1', color: 'var(--text-primary)' }}>
                        Student Internship <br />
                        <span className="text-gradient">Management System</span>
                      </h1>
                      <p className="lead text-secondary mb-5 fs-4" style={{ maxWidth: '600px' }}>
                        Empower your academic journey with a streamlined platform for discovering, managing, and excelling in your internships.
                      </p>
                      <div className="d-flex flex-wrap gap-3">
                        <Button 
                          size="lg" 
                          className="btn-primary rounded-pill px-5 py-3 shadow-lg d-flex align-items-center gap-2"
                          onClick={() => setView('login-selection')}
                        >
                          Get Started <ArrowRight size={20} />
                        </Button>
                        <Button 
                          variant="outline-dark" 
                          size="lg" 
                          className="rounded-pill px-4 py-3 shadow-sm border-2"
                        >
                          Learn More
                        </Button>
                      </div>
                    </motion.div>
                  </Col>
                  <Col lg={5}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="hero-image-container"
                    >
                      <img 
                        src="/assets/hero-banner.png" 
                        alt="Student working" 
                        className="img-fluid rounded-4 shadow-2xl"
                        style={{ transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)', border: '8px solid white' }}
                      />
                    </motion.div>
                  </Col>
                </Row>
              </Container>
            </motion.section>
          ) : (
            <motion.section
              key="login-selection"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="login-selection-section py-5 d-flex align-items-center"
              style={{ minHeight: '80vh' }}
            >
              <Container>
                <div className="text-center mb-5">
                  <Button 
                    variant="link" 
                    className="text-decoration-none text-secondary mb-3 d-inline-flex align-items-center gap-2"
                    onClick={() => setView('hero')}
                  >
                    ← Back to Home
                  </Button>
                  <h2 className="display-5 fw-bold mb-3">Choose Your Portal</h2>
                  <p className="text-secondary fs-5">Select the account type you would like to log in with</p>
                </div>
                
                <Row className="g-4 justify-content-center">
                  {loginRoles.map((role, idx) => (
                    <Col lg={4} md={6} key={role.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card 
                          className="h-100 border-0 glass-panel p-4 text-center hover-lift overflow-hidden position-relative"
                          style={{ background: '#fff' }}
                        >
                          <div className="position-absolute top-0 end-0 p-3 opacity-10" style={{ transform: 'translate(20%, -20%)' }}>
                            {React.cloneElement(role.icon, { size: 120 })}
                          </div>
                          
                          <div className="d-inline-flex p-4 rounded-4 mb-4 mx-auto" 
                               style={{ background: `${role.color}15`, color: role.color }}>
                            {role.icon}
                          </div>
                          
                          <h4 className="fw-bold mb-3">{role.title}</h4>
                          <p className="text-secondary mb-4 small">
                            {role.desc}
                          </p>
                          
                          <Button 
                            className="w-100 rounded-pill py-2 fw-bold"
                            style={{ background: role.gradient, border: 'none', boxShadow: `0 4px 15px ${role.color}40` }}
                            onClick={() => handleRoleSelect(role.id)}
                          >
                            Login as {role.title.split(' ')[0]}
                          </Button>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Container>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Simple About Section */}
        <section id="about" className="py-5 bg-white">
          <Container className="py-5 text-center">
            <h2 className="fw-bold mb-4">About InternSync</h2>
            <p className="text-secondary mx-auto fs-5" style={{ maxWidth: '800px' }}>
              InternSync is a comprehensive internship management platform designed to bridge the gap between academic learning and professional experience. We provide students with the tools to find meaningful opportunities and coordinators with the oversight needed to ensure success.
            </p>
          </Container>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-5">
          <Container className="py-5 text-center">
            <h2 className="fw-bold mb-4">Get in Touch</h2>
            <p className="text-secondary mb-5">Have questions? We're here to help you navigate your journey.</p>
            <div className="d-flex justify-content-center gap-4">
              <Button variant="outline-primary" className="rounded-pill px-4 py-2">Email Support</Button>
              <Button variant="primary" className="rounded-pill px-4 py-2">Join Community</Button>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-5 bg-white border-top">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <div className="d-flex align-items-center gap-2 mb-2 justify-content-center justify-content-md-start">
                <div className="rounded-circle d-flex justify-content-center align-items-center" 
                     style={{ background: 'var(--gradient-brand)', width: '24px', height: '24px', color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>
                  IS
                </div>
                <span className="fw-bold text-gradient">InternSync</span>
              </div>
              <p className="text-muted small m-0">© 2026 Student Internship Management System. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="d-flex gap-3 justify-content-center justify-content-md-end">
                {/* Social Links Removed */}
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Custom Styles */}
      <style>{`
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
        }
        .hero-section {
          background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.05), transparent 40%);
        }
        .text-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.05) !important;
          border-radius: 24px !important;
        }
        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          transition: transform 0.2s;
        }
        .btn-primary:hover {
          transform: scale(1.02);
          opacity: 0.9;
        }
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default Home;
