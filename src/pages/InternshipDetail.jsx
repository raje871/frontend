import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building, Clock, DollarSign, Calendar, ArrowLeft, Send, Award, Briefcase, MessageSquare, Info } from 'lucide-react';
import API from '../services/api';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const { data } = await API.get(`/internships/${id}`);
      setInternship(data);
    } catch (err) {
      setError('Failed to load internship details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" color="var(--accent-indigo)" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <Button variant="link" className="text-decoration-none text-secondary d-flex align-items-center gap-2 mb-4 p-0" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back to Listings
      </Button>

      {error && <Alert variant="danger">{error}</Alert>}

      {internship && (
        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: '24px' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-4 gap-3">
                <div className="d-flex align-items-center gap-4">
                  <div className="rounded-4 d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" style={{ width: '80px', height: '80px', background: 'var(--gradient-brand)', fontSize: '2rem' }}>
                    {internship.company.charAt(0)}
                  </div>
                  <div>
                    <h2 className="fw-bold mb-1">{internship.title}</h2>
                    <p className="text-secondary mb-0 d-flex align-items-center gap-2 fs-5">
                      <Building size={20} /> {internship.company}
                    </p>
                  </div>
                </div>
                <Badge bg="primary-subtle" className="text-primary px-4 py-2 rounded-pill fs-6 fw-normal">
                  {internship.type}
                </Badge>
              </div>

              <Row className="g-4 mb-5 p-4 bg-light rounded-4">
                <Col xs={6} md={3}>
                  <div className="text-muted small mb-1 d-flex align-items-center gap-1"><MapPin size={14}/> Location</div>
                  <div className="fw-bold">{internship.location}</div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="text-muted small mb-1 d-flex align-items-center gap-1"><DollarSign size={14}/> Stipend</div>
                  <div className="fw-bold text-success">{internship.stipend}</div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="text-muted small mb-1 d-flex align-items-center gap-1"><Clock size={14}/> Duration</div>
                  <div className="fw-bold">{internship.duration}</div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="text-muted small mb-1 d-flex align-items-center gap-1"><Calendar size={14}/> Deadline</div>
                  <div className="fw-bold text-danger">
                    {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'Rolling'}
                  </div>
                </Col>
              </Row>

              <div className="mb-5">
                <h5 className="fw-bold mb-3">About the Role</h5>
                <p className="text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                  {internship.description}
                </p>
              </div>

              <div>
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Award size={20} className="text-primary" /> Skills Required
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {internship.skillsRequired.map((skill, i) => (
                    <Badge key={i} bg="white" className="text-dark border px-4 py-2 rounded-3 fw-normal fs-6">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm p-4 position-sticky" style={{ borderRadius: '24px', top: '20px' }}>
              <h5 className="fw-bold mb-4">Quick Summary</h5>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="bg-transparent border-0 px-0 d-flex justify-content-between">
                  <span className="text-muted">Posted On</span>
                  <span className="fw-bold">{new Date(internship.createdAt).toLocaleDateString()}</span>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent border-0 px-0 d-flex justify-content-between">
                  <span className="text-muted">Status</span>
                  <Badge bg="success-subtle" className="text-success rounded-pill fw-normal">Open</Badge>
                </ListGroup.Item>
              </ListGroup>
              
              <Button 
                variant="primary" 
                className="w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
              >
                <Send size={20} /> Apply Now
              </Button>
              <Button 
                variant="outline-primary" 
                className="w-100 py-3 rounded-pill fw-bold mb-3 d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate('/app/messages', { state: { recipient: internship.postedBy } })}
              >
                <MessageSquare size={20} /> Contact Employer
              </Button>
              <Button variant="outline-secondary" className="w-100 py-3 rounded-pill fw-bold">
                Save for later
              </Button>

              <div className="mt-5 p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-10">
                <h6 className="fw-bold text-primary d-flex align-items-center gap-2">
                  <Info size={16} /> Pro Tip
                </h6>
                <p className="small text-muted mb-0">Make sure your resume is up-to-date in your profile before applying!</p>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </motion.div>
  );
};

export default InternshipDetail;
