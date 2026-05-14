import React from 'react';
import { Navbar, Container, Form, InputGroup, Dropdown, ListGroup, Badge } from 'react-bootstrap';
import { Search, Bell, User, LogOut, CheckCircle, Info, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, title: 'Application Accepted', desc: 'TechCorp accepted your application.', time: '2h ago', icon: <CheckCircle size={14} />, color: 'success' },
    { id: 2, title: 'New Message', desc: 'You have a message from HR Team.', time: '5h ago', icon: <MessageSquare size={14} />, color: 'primary' },
    { id: 3, title: 'Profile Tip', desc: 'Complete your skills to get noticed.', time: '1d ago', icon: <Info size={14} />, color: 'info' },
  ];

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Navbar expand="lg" className="px-4 py-2 border-bottom" style={{ height: '70px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000 }}>
        <Container fluid className="px-0">
          <Navbar.Brand as={Link} to="/app/dashboard" className="d-lg-none d-flex align-items-center gap-2">
            <div className="rounded-circle d-flex justify-content-center align-items-center" style={{ background: 'var(--gradient-brand)', width: '32px', height: '32px', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>IS</div>
            <span className="fw-bold text-gradient">InternSync</span>
          </Navbar.Brand>
          <div className="d-flex w-100 justify-content-end justify-content-lg-between align-items-center">

            {/* Search Bar */}
            <div className="d-none d-lg-block" style={{ width: '320px' }}>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-end-0 ps-3" style={{ color: 'var(--text-muted)' }}>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search internships..."
                  className="border-start-0 ps-0 shadow-none"
                  style={{ background: 'transparent' }}
                />
              </InputGroup>
            </div>

            {/* Right Actions */}
            <div className="d-flex align-items-center gap-2 gap-md-3">
              
              {/* Notifications Dropdown */}
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" className="text-decoration-none p-2 border-0 shadow-none position-relative" style={{ color: 'var(--text-secondary)' }}>
                  <Bell size={20} />
                  <span className="position-absolute top-0 start-50 translate-middle-y badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', marginTop: '5px' }}>
                    3
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="border-0 shadow-lg p-0 mt-3 overflow-hidden" style={{ borderRadius: '16px', minWidth: '320px' }}>
                  <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">Notifications</h6>
                    <Badge bg="primary-subtle" className="text-primary rounded-pill fw-normal">3 New</Badge>
                  </div>
                  <ListGroup variant="flush">
                    {notifications.map((note) => (
                      <ListGroup.Item key={note.id} action className="px-4 py-3 border-0 d-flex gap-3 align-items-start hover-bg-light">
                        <div className={`p-2 rounded-3 bg-${note.color}-subtle text-${note.color}`}>
                          {note.icon}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <span className="small fw-bold">{note.title}</span>
                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>{note.time}</span>
                          </div>
                          <p className="mb-0 text-muted small">{note.desc}</p>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <div className="px-4 py-2 border-top text-center">
                    <button className="btn btn-link text-decoration-none btn-sm fw-bold" style={{ color: 'var(--accent-indigo)' }}>View All Notifications</button>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              {/* User Profile Dropdown */}
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" className="text-decoration-none d-flex align-items-center gap-2 p-0 border-0 shadow-none" style={{ color: 'var(--text-secondary)' }}>
                  <div className="rounded-circle d-flex justify-content-center align-items-center" style={{ width: '36px', height: '36px', background: 'var(--gradient-brand)' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                    </span>
                  </div>
                  <div className="d-none d-md-block text-start">
                    <p className="mb-0 fw-medium" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                    <p className="mb-0" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="border-0 shadow-lg mt-2 p-2" style={{ borderRadius: '16px', minWidth: '200px' }}>
                  <Dropdown.Item onClick={() => navigate('/app/profile')} className="d-flex align-items-center gap-3 py-2 rounded-3">
                    <User size={18} className="text-muted" /> 
                    <span className="fw-medium">My Profile</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/app/settings')} className="d-flex align-items-center gap-3 py-2 rounded-3">
                    <Dropdown.Item className="p-0 border-0 d-flex align-items-center gap-3">
                      <LogOut size={0} /> {/* Placeholder for alignment */}
                    </Dropdown.Item>
                    <span className="fw-medium">Settings</span>
                  </Dropdown.Item>
                  <Dropdown.Divider className="my-2 mx-2" />
                  <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center gap-3 py-2 rounded-3">
                    <LogOut size={18} /> 
                    <span className="fw-medium">Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default TopNavbar;
