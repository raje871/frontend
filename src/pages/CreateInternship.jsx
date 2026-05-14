import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, List, X, Plus, Calendar, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createInternship } from '../services/api';

const CreateInternship = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    stipend: '',
    duration: '',
    description: '',
    deadline: '',
    skillsRequired: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(s => s !== skill)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createInternship(formData);
      navigate('/internships');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create internship posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Post an Internship</h2>
        <p className="text-secondary">Reach out to the best candidates for your company</p>
      </div>

      {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

      <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
        <Card.Body className="p-4 p-md-5">
          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center gap-2">
                    <Briefcase size={18} className="text-primary" /> Internship Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="e.g. Frontend Developer Intern"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center gap-2">
                    <Briefcase size={18} className="text-primary" /> Company Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    placeholder="e.g. InternSync Inc."
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center gap-2">
                    <MapPin size={18} className="text-primary" /> Location
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium">Job Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="py-2"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center gap-2">
                    <DollarSign size={18} className="text-primary" /> Stipend
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="stipend"
                    placeholder="e.g. $500/month or Unpaid"
                    value={formData.stipend}
                    onChange={handleChange}
                    className="py-2"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center gap-2">
                    <Clock size={18} className="text-primary" /> Duration
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    placeholder="e.g. 3 Months"
                    value={formData.duration}
                    onChange={handleChange}
                    className="py-2"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center gap-2">
                    <Calendar size={18} className="text-primary" /> Application Deadline
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="py-2"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-medium d-flex align-items-center gap-2">
                    <List size={18} className="text-primary" /> Required Skills
                  </Form.Label>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      placeholder="e.g. React, Node.js"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      className="py-2"
                    />
                    <Button variant="primary" onClick={handleAddSkill} className="px-3">
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {formData.skillsRequired.map((skill, index) => (
                      <Badge
                        key={index}
                        bg="light"
                        className="text-dark border d-flex align-items-center gap-2 py-2 px-3 fw-normal"
                        style={{ borderRadius: '10px' }}
                      >
                        {skill}
                        <X
                          size={14}
                          className="text-danger cursor-pointer"
                          onClick={() => handleRemoveSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-medium">Job Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={6}
                    placeholder="Provide a detailed description of the internship, responsibilities, and requirements..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '15px' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-3 mt-5">
              <Button
                variant="outline-secondary"
                className="px-4 py-2 fw-medium"
                style={{ borderRadius: '10px' }}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-5 py-2 fw-medium d-flex align-items-center gap-2"
                style={{ borderRadius: '10px' }}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : <><Save size={18} /> Post Internship</>}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default CreateInternship;
