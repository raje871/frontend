import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Link2, Award, Save, X, Plus, Book, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMe, updateProfile } from '../services/api';

const Profile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [],
    resumeLink: '',
    bio: '',
    education: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await getMe();
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        skills: data.skills || [],
        resumeLink: data.resumeLink || '',
        bio: data.bio || '',
        education: data.education || '',
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await updateProfile(formData);
      setProfile(data);
      const updatedUser = { ...user, ...data };
      login(updatedUser);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--accent-indigo)' }} /></div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>My Profile</h2>
          <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>Manage your personal professional identity</p>
        </div>
        {!editing && (
          <Button variant="primary" className="rounded-pill px-4" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {success && <Alert variant="success" className="rounded-3 shadow-sm">{success}</Alert>}
      {error && <Alert variant="danger" className="rounded-3 shadow-sm">{error}</Alert>}

      <Row className="g-4">
        <Col lg={4}>
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ height: '100px', background: 'var(--gradient-brand)', opacity: 0.8 }}></div>
              <Card.Body className="p-4 pt-0 text-center">
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center mx-auto border border-4 border-white shadow-sm"
                  style={{ width: '100px', height: '100px', background: '#f8f9fa', marginTop: '-50px', fontSize: '2.5rem', color: 'var(--accent-indigo)', fontWeight: 'bold' }}
                >
                  {profile?.name?.charAt(0)?.toUpperCase()}
                </div>
                <h5 className="fw-bold mt-3 mb-1">{profile?.name}</h5>
                <Badge className="fw-normal px-3 py-2 mb-3 rounded-pill" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                  {profile?.role.toUpperCase()}
                </Badge>
                
                <p className="text-muted small mb-4">{profile?.bio || 'No bio provided yet.'}</p>

                <div className="text-start border-top pt-4">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Award size={18} className="text-primary" /> Top Skills</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {profile?.skills?.map((skill, i) => (
                      <Badge key={i} bg="light" className="text-dark border font-weight-normal">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {profile?.resumeLink && (
                  <Button href={profile.resumeLink} target="_blank" variant="outline-primary" className="w-100 mt-4 rounded-pill d-flex align-items-center justify-content-center gap-2">
                    <Link2 size={16} /> View Resume
                  </Button>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col lg={8}>
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
              <Form onSubmit={handleSubmit}>
                <h5 className="fw-bold mb-4">Professional Details</h5>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Full Name</Form.Label>
                      <Form.Control name="name" value={formData.name} onChange={handleChange} disabled={!editing} className="bg-light border-0 py-2" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Email Address</Form.Label>
                      <Form.Control name="email" value={formData.email} onChange={handleChange} disabled={!editing} className="bg-light border-0 py-2" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Education</Form.Label>
                      <Form.Control name="education" placeholder="e.g. B.Tech in Computer Science, 2024" value={formData.education} onChange={handleChange} disabled={!editing} className="bg-light border-0 py-2" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Short Bio</Form.Label>
                      <Form.Control as="textarea" rows={3} name="bio" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleChange} disabled={!editing} className="bg-light border-0 py-2" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Skills</Form.Label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {formData.skills.map((skill, i) => (
                          <Badge key={i} bg="primary-subtle" className="text-primary border-0 d-flex align-items-center gap-2 py-2 px-3 fw-normal">
                            {skill} {editing && <X size={14} className="cursor-pointer" onClick={() => handleRemoveSkill(skill)} />}
                          </Badge>
                        ))}
                      </div>
                      {editing && (
                        <div className="d-flex gap-2">
                          <Form.Control placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={handleKeyDown} className="bg-light border-0" />
                          <Button variant="primary" onClick={handleAddSkill}><Plus size={20} /></Button>
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {editing && (
                  <div className="d-flex gap-3 mt-5">
                    <Button variant="primary" type="submit" disabled={saving} className="px-5 py-2 rounded-pill d-flex align-items-center gap-2">
                      {saving ? <Spinner size="sm" /> : <><Save size={18} /> Save Changes</>}
                    </Button>
                    <Button variant="outline-secondary" className="px-4 py-2 rounded-pill" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                )}
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Profile;
