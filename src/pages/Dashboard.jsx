import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Briefcase, FileText, CheckCircle, Clock, MapPin, Building, TrendingUp, PlusCircle } from 'lucide-react';
import { getStats, getInternships } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentInternships, setRecentInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, internshipsRes] = await Promise.all([
        getStats(),
        getInternships()
      ]);
      setStats(statsRes.data);
      setRecentInternships(internshipsRes.data.slice(0, 4));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { title: stats.card1.label, value: stats.card1.value, icon: <Briefcase size={22} />, color: '#6366f1', bg: 'rgba(99,102,241,0.08)', trend: 'Live data' },
    { title: stats.card2.label, value: stats.card2.value, icon: <TrendingUp size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.08)', trend: 'Updated now' },
    { title: stats.card3.label, value: stats.card3.value, icon: <Clock size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', trend: 'Action needed' },
  ] : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" color="var(--accent-indigo)" /></div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back, {user?.name?.split(' ')[0] || 'Intern'}! 👋</h2>
          <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your internships today.</p>
        </div>
        {!['student'].includes(user?.role) ? (
          <Button as={Link} to="/app/create-internship" variant="primary" className="d-flex align-items-center gap-2 rounded-pill px-4">
            <PlusCircle size={18} />
            Post New Role
          </Button>
        ) : (
          <Button as={Link} to="/app/internships" variant="primary" className="d-flex align-items-center gap-2 rounded-pill px-4">
            <Briefcase size={18} />
            Explore Internships
          </Button>
        )}
      </div>

      {/* Stats */}
      <Row className="g-4 mb-5">
        {statCards.map((stat, index) => (
          <Col md={4} key={index}>
            <motion.div variants={itemVariants}>
              <Card className="border-0 h-100" style={{ background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-card)' }}>
                <Card.Body className="p-4 d-flex align-items-start justify-content-between">
                  <div>
                    <p className="fw-medium mb-1" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.title}</p>
                    <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</h3>
                    <small style={{ color: 'var(--text-muted)' }}>{stat.trend}</small>
                  </div>
                  <div className="p-3 rounded-3 d-flex align-items-center justify-content-center" style={{ background: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Feed */}
      <motion.div variants={itemVariants}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0" style={{ color: 'var(--text-primary)' }}>{user?.role === 'student' ? 'Recent Postings' : 'Your Recent Postings'}</h4>
          <Button as={Link} to={user?.role === 'student' ? "/app/internships" : "/app/manage-postings"} variant="link" className="text-decoration-none" style={{ color: 'var(--accent-indigo)' }}>View All</Button>
        </div>

        <Row className="g-4">
          {recentInternships.map((internship) => (
            <Col md={6} key={internship._id}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Card className="border-0 h-100" style={{ background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-card)' }}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 d-flex justify-content-center align-items-center fw-bold" style={{ width: '48px', height: '48px', background: 'var(--gradient-brand)', color: '#fff', fontSize: '1rem' }}>
                          {internship.company.charAt(0)}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>{internship.title}</h6>
                          <div className="d-flex align-items-center gap-1" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            <Building size={14} /> {internship.company}
                          </div>
                        </div>
                      </div>
                      <Badge bg="light" className="border fw-normal" style={{ color: 'var(--text-secondary)', borderRadius: '20px', fontSize: '0.75rem' }}>
                        {internship.type}
                      </Badge>
                    </div>

                    <div className="d-flex gap-3 mb-4" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div className="d-flex align-items-center gap-1">
                        <MapPin size={14} /> {internship.location}
                      </div>
                      <div className="d-flex align-items-center gap-1 fw-medium" style={{ color: '#10b981' }}>
                        {internship.stipend}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button as={Link} to={`/app/internship/${internship._id}`} variant="outline-secondary" className="flex-grow-1" style={{ borderRadius: '10px', fontSize: '0.9rem' }}>View Details</Button>
                      <Button as={Link} to="/app/internships" variant="primary" className="flex-grow-1" style={{ fontSize: '0.9rem' }}>{user?.role === 'student' ? 'Apply Now' : 'Manage Applicants'}</Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
