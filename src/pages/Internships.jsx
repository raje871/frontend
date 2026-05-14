import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, InputGroup, Form, Spinner, Alert, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building, Clock, Briefcase, SlidersHorizontal, Send, FileText, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getInternships, applyToInternship } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TYPE_COLORS = {
  'Full-time': { bg: 'rgba(99,102,241,0.08)', color: '#6366f1' },
  'Part-time': { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b' },
  'Remote': { bg: 'rgba(16,185,129,0.08)', color: '#10b981' },
};

const Internships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Application Modal State
  const [showApply, setShowApply] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applyData, setApplyData] = useState({ coverLetter: '', resumeLink: '' });
  const [applying, setApplying] = useState(false);
  const [applyStatus, setApplyStatus] = useState({ type: '', message: '' });

  const filters = ['All', 'Full-time', 'Part-time', 'Remote'];

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    let result = internships;
    if (activeFilter !== 'All') {
      result = result.filter((i) => i.type === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          (i.skillsRequired || []).some((s) => s.toLowerCase().includes(q))
      );
    }
    setFiltered(result);
  }, [search, activeFilter, internships]);

  const fetchInternships = async () => {
    try {
      const { data } = await getInternships();
      setInternships(data);
      setFiltered(data);
    } catch {
      setError('Failed to load internships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApply = (internship) => {
    setSelectedInternship(internship);
    setApplyData({ coverLetter: '', resumeLink: user?.resumeLink || '' });
    setApplyStatus({ type: '', message: '' });
    setShowApply(true);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyStatus({ type: '', message: '' });

    try {
      await applyToInternship({
        internshipId: selectedInternship._id,
        ...applyData
      });
      setApplyStatus({ type: 'success', message: 'Application submitted successfully!' });
      setTimeout(() => {
        setShowApply(false);
        setApplyStatus({ type: '', message: '' });
      }, 2000);
    } catch (err) {
      setApplyStatus({ 
        type: 'danger', 
        message: err.response?.data?.message || 'Failed to submit application.' 
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Browse Internships</h2>
          <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} opportunities found
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <Card className="border-0 mb-4 p-3 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
          <InputGroup style={{ maxWidth: '380px' }}>
            <InputGroup.Text className="bg-transparent border-end-0 ps-3">
              <Search size={18} color="var(--text-muted)" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search roles, companies..."
              className="border-start-0 shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <div className="d-flex gap-2 overflow-auto">
            {filters.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={activeFilter === f ? "primary" : "outline-secondary"}
                onClick={() => setActiveFilter(f)}
                style={{ borderRadius: '20px', padding: '0.3rem 1.2rem' }}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" color="var(--accent-indigo)" /></div>
      ) : (
        <Row className="g-4">
          <AnimatePresence>
            {filtered.map((item) => {
              const style = TYPE_COLORS[item.type] || TYPE_COLORS['Full-time'];
              return (
                <Col md={6} key={item._id}>
                  <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <Card className="border-0 h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-3 d-flex align-items-center justify-content-center bg-light fw-bold" style={{ width: '45px', height: '45px', color: 'var(--accent-indigo)' }}>
                              {item.company.charAt(0)}
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0">{item.title}</h6>
                              <small className="text-muted">{item.company}</small>
                            </div>
                          </div>
                          <Badge style={{ background: style.bg, color: style.color, borderRadius: '20px', padding: '0.4rem 0.8rem' }}>
                            {item.type}
                          </Badge>
                        </div>
                        
                        <div className="d-flex gap-3 mb-3 text-muted small">
                          <span className="d-flex align-items-center gap-1"><MapPin size={14}/> {item.location}</span>
                          <span className="d-flex align-items-center gap-1"><Clock size={14}/> {item.duration}</span>
                        </div>

                        <div className="d-flex gap-2 mt-4">
                          <Button as={Link} to={`/app/internship/${item._id}`} variant="outline-primary" className="flex-grow-1" style={{ borderRadius: '10px' }}>View Details</Button>
                          <Button 
                            variant="primary" 
                            className="flex-grow-1" 
                            style={{ borderRadius: '10px' }}
                            onClick={() => handleOpenApply(item)}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </AnimatePresence>
        </Row>
      )}

      {/* Apply Modal */}
      <Modal show={showApply} onHide={() => !applying && setShowApply(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Apply to {selectedInternship?.company}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <p className="text-muted mb-4">Role: <span className="text-dark fw-medium">{selectedInternship?.title}</span></p>
          
          {applyStatus.message && (
            <Alert variant={applyStatus.type} className="rounded-3">{applyStatus.message}</Alert>
          )}

          <Form onSubmit={handleApply}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Cover Letter</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Briefly explain why you're a good fit..."
                value={applyData.coverLetter}
                onChange={(e) => setApplyData({...applyData, coverLetter: e.target.value})}
                required
                className="border-0 bg-light"
                style={{ borderRadius: '12px' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Resume Link (Optional)</Form.Label>
              <div className="position-relative">
                <Link2 size={16} className="position-absolute" style={{ top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                <Form.Control 
                  type="url"
                  placeholder="Link to your portfolio or resume..."
                  value={applyData.resumeLink}
                  onChange={(e) => setApplyData({...applyData, resumeLink: e.target.value})}
                  className="border-0 bg-light ps-5"
                  style={{ borderRadius: '12px' }}
                />
              </div>
              <Form.Text className="text-muted">Will use the resume from your profile if left blank.</Form.Text>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              disabled={applying}
              style={{ borderRadius: '12px' }}
            >
              {applying ? <Spinner size="sm" /> : <><Send size={18} /> Submit Application</>}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default Internships;
