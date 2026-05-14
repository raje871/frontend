import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Spinner, Alert, Table, Modal } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, FileText, Link2, CheckCircle, XCircle, ArrowLeft, Award } from 'lucide-react';
import API from '../services/api';

const InternshipApplicants = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Detail Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [appRes, intRes] = await Promise.all([
        API.get(`/applications/internship/${id}`),
        API.get(`/internships/${id}`)
      ]);
      setApplications(appRes.data);
      setInternship(intRes.data);
    } catch (err) {
      setError('Failed to load applicants or internship details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await API.put(`/applications/${appId}`, { status: newStatus });
      setApplications(applications.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
      if (selectedApp?._id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" color="var(--accent-indigo)" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <Link to="/app/manage-postings" className="text-decoration-none d-flex align-items-center gap-2 mb-4 text-secondary hover-primary">
        <ArrowLeft size={18} /> Back to Postings
      </Link>

      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Applicants for "{internship?.title}"</h2>
        <p className="text-secondary">Review and manage candidates for this position</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {applications.length === 0 ? (
        <Card className="border-0 text-center p-5 shadow-sm" style={{ borderRadius: '16px' }}>
          <User size={48} className="mx-auto mb-3 text-muted" />
          <h5 className="fw-bold">No applicants yet</h5>
          <p className="text-muted">Applications will appear here once students start applying.</p>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">Student</th>
                  <th className="py-3 border-0">Skills</th>
                  <th className="py-3 border-0">Applied On</th>
                  <th className="py-3 border-0">Status</th>
                  <th className="py-3 border-0 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: '40px', height: '40px' }}>
                          {app.applicant.name.charAt(0)}
                        </div>
                        <div>
                          <div className="fw-bold">{app.applicant.name}</div>
                          <small className="text-muted">{app.applicant.email}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex flex-wrap gap-1">
                        {app.applicant.skills.slice(0, 2).map((skill, i) => (
                          <Badge key={i} bg="light" className="text-dark border font-weight-normal" style={{ fontSize: '0.7rem' }}>{skill}</Badge>
                        ))}
                        {app.applicant.skills.length > 2 && <small className="text-muted">+{app.applicant.skills.length - 2} more</small>}
                      </div>
                    </td>
                    <td className="py-3 text-muted">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <Badge 
                        className="rounded-pill px-3 py-2 text-capitalize"
                        bg={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-end px-4">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="rounded-pill px-3"
                        onClick={() => { setSelectedApp(app); setShowModal(true); }}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Review Application</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-0">
          {selectedApp && (
            <Row className="g-4">
              <Col md={5}>
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3 text-primary fw-bold" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                    {selectedApp.applicant.name.charAt(0)}
                  </div>
                  <h4 className="fw-bold mb-1">{selectedApp.applicant.name}</h4>
                  <p className="text-muted d-flex align-items-center justify-content-center gap-2">
                    <Mail size={16} /> {selectedApp.applicant.email}
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold d-flex align-items-center gap-2 mb-3">
                    <Award size={18} className="text-primary" /> Skills
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedApp.applicant.skills.map((skill, i) => (
                      <Badge key={i} bg="light" className="text-dark border py-2 px-3 fw-normal" style={{ borderRadius: '8px' }}>{skill}</Badge>
                    ))}
                  </div>
                </div>

                {selectedApp.resumeLink && (
                  <Button 
                    href={selectedApp.resumeLink} 
                    target="_blank" 
                    variant="outline-primary" 
                    className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill"
                  >
                    <Link2 size={18} /> View Resume
                  </Button>
                )}
              </Col>

              <Col md={7}>
                <div className="h-100 p-4 bg-light" style={{ borderRadius: '16px' }}>
                  <h6 className="fw-bold d-flex align-items-center gap-2 mb-3">
                    <FileText size={18} className="text-primary" /> Cover Letter
                  </h6>
                  <p className="text-secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {selectedApp.coverLetter || "No cover letter provided."}
                  </p>
                </div>
              </Col>

              <Col xs={12}>
                <hr className="my-4" />
                <div className="d-flex justify-content-end gap-3">
                  <Button 
                    variant="outline-danger" 
                    className="d-flex align-items-center gap-2 px-4 rounded-pill"
                    onClick={() => handleStatusUpdate(selectedApp._id, 'rejected')}
                    disabled={selectedApp.status === 'rejected'}
                  >
                    <XCircle size={18} /> Reject Application
                  </Button>
                  <Button 
                    variant="success" 
                    className="d-flex align-items-center gap-2 px-4 rounded-pill"
                    onClick={() => handleStatusUpdate(selectedApp._id, 'accepted')}
                    disabled={selectedApp.status === 'accepted'}
                  >
                    <CheckCircle size={18} /> Accept Application
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default InternshipApplicants;
