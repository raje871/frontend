import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Spinner, Alert, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FileText, Calendar, Building, Clock, Info } from 'lucide-react';
import { getMyApplications } from '../services/api';

const STATUS_COLORS = {
  'pending': { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b' },
  'accepted': { bg: 'rgba(16,185,129,0.08)', color: '#10b981' },
  'rejected': { bg: 'rgba(239,68,68,0.08)', color: '#ef4444' },
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await getMyApplications();
      setApplications(data);
    } catch {
      setError('Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" color="var(--accent-indigo)" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>My Applications</h2>
        <p className="text-secondary">Track the status of your internship applications</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {applications.length === 0 ? (
        <Card className="border-0 text-center p-5 shadow-sm" style={{ borderRadius: '16px' }}>
          <FileText size={48} className="mx-auto mb-3 text-muted" />
          <h5 className="fw-bold">No applications yet</h5>
          <p className="text-muted">You haven't applied to any internships yet. Start browsing!</p>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">Internship</th>
                  <th className="py-3 border-0">Company</th>
                  <th className="py-3 border-0">Date Applied</th>
                  <th className="py-3 border-0">Status</th>
                  <th className="py-3 border-0 text-end px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const status = STATUS_COLORS[app.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={app._id}>
                      <td className="px-4 py-3 fw-bold">{app.internship?.title}</td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2">
                          <Building size={16} className="text-muted" />
                          {app.internship?.company}
                        </div>
                      </td>
                      <td className="py-3 text-muted">
                        <Calendar size={16} className="me-2" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Badge 
                          style={{ 
                            background: status.bg, 
                            color: status.color, 
                            borderRadius: '20px', 
                            padding: '0.4rem 0.8rem',
                            textTransform: 'capitalize'
                          }}
                        >
                          {app.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-end px-4">
                        <button className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-1" style={{ color: 'var(--accent-indigo)', fontSize: '0.9rem' }}>
                          <Info size={16} /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Applications;
