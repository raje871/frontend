import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Briefcase, Users, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const ManagePostings = () => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    try {
      // Note: We need an endpoint to get only internships posted by the current user
      // For now, let's assume getInternships returns all, but we'll filter on backend if possible
      // Actually, let's create a specific service call for this
      const { data } = await API.get('/internships/my');
      setPostings(data);
    } catch (err) {
      setError('Failed to load your postings. Make sure you are logged in as a company.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await API.delete(`/internships/${id}`);
        setPostings(postings.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to delete internship');
      }
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" color="var(--accent-indigo)" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Manage Internships</h2>
          <p className="text-secondary">Track and manage your internship postings</p>
        </div>
        <Button as={Link} to="/app/create-internship" variant="primary" className="rounded-pill px-4">
          Post New Internship
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {postings.length === 0 ? (
        <Card className="border-0 text-center p-5 shadow-sm" style={{ borderRadius: '16px' }}>
          <Briefcase size={48} className="mx-auto mb-3 text-muted" />
          <h5 className="fw-bold">No postings found</h5>
          <p className="text-muted">You haven't posted any internships yet.</p>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">Internship</th>
                  <th className="py-3 border-0">Status</th>
                  <th className="py-3 border-0">Applicants</th>
                  <th className="py-3 border-0">Posted Date</th>
                  <th className="py-3 border-0 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {postings.map((post) => (
                  <tr key={post._id}>
                    <td className="px-4 py-3">
                      <div className="fw-bold">{post.title}</div>
                      <small className="text-muted">{post.location} • {post.type}</small>
                    </td>
                    <td className="py-3">
                      <Badge bg={post.status === 'open' ? 'success' : 'secondary'} className="rounded-pill px-3 py-2 text-capitalize">
                        {post.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <Users size={16} />
                        <span className="fw-bold">{post.applicantCount || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button as={Link} to={`/app/internship/${post._id}/applicants`} variant="outline-primary" size="sm" className="rounded-pill px-3">
                          View Applicants
                        </Button>
                        <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => handleDelete(post._id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default ManagePostings;
