import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Moon, Globe, Trash2 } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Account Settings</h2>
        <p className="text-secondary">Manage your account preferences and security</p>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
            <ListGroup variant="flush">
              <ListGroup.Item className="p-3 bg-light border-0 fw-bold d-flex align-items-center gap-2">
                <SettingsIcon size={18} /> General
              </ListGroup.Item>
              <ListGroup.Item action className="p-3 border-0 d-flex align-items-center gap-2">
                <Bell size={18} className="text-muted" /> Notifications
              </ListGroup.Item>
              <ListGroup.Item action className="p-3 border-0 d-flex align-items-center gap-2">
                <Shield size={18} className="text-muted" /> Privacy & Security
              </ListGroup.Item>
              <ListGroup.Item action className="p-3 border-0 d-flex align-items-center gap-2">
                <Globe size={18} className="text-muted" /> Language
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold mb-4">Preferences</h5>
            <Form>
              <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 fw-bold">Email Notifications</h6>
                  <small className="text-muted">Receive alerts about new applications and status updates</small>
                </div>
                <Form.Check 
                  type="switch"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="custom-switch"
                />
              </Form.Group>

              <hr />

              <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 fw-bold">Dark Mode</h6>
                  <small className="text-muted">Switch between light and dark theme (Coming soon)</small>
                </div>
                <Form.Check 
                  type="switch"
                  checked={darkMode}
                  disabled
                  className="custom-switch"
                />
              </Form.Group>
            </Form>
          </Card>

          <Card className="border-0 shadow-sm p-4 border-danger-subtle" style={{ borderRadius: '16px', borderLeft: '4px solid #ef4444' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0 fw-bold text-danger">Danger Zone</h6>
                <small className="text-muted">Permanently delete your account and all associated data</small>
              </div>
              <Button variant="outline-danger" className="rounded-pill px-4 d-flex align-items-center gap-2">
                <Trash2 size={16} /> Delete Account
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Settings;
