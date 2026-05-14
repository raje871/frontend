import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, MessageSquare, Settings, LogOut, User, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Internships', path: '/app/internships', icon: <Briefcase size={20} /> },
    { name: 'Applications', path: '/app/applications', icon: <FileText size={20} /> },
    { name: 'Messages', path: '/app/messages', icon: <MessageSquare size={20} /> },
    { name: 'Profile', path: '/app/profile', icon: <User size={20} /> },
  ];

  // Conditional items for companies/admins/mentors/coordinators
  if (['company', 'admin', 'mentor', 'coordinator'].includes(user?.role)) {
    navItems.splice(2, 0, { name: 'Post Internship', path: '/app/create-internship', icon: <PlusCircle size={20} /> });
    navItems.splice(3, 0, { name: 'Manage Internships', path: '/app/manage-postings', icon: <Briefcase size={20} /> });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="sidebar d-flex flex-column p-3"
      style={{ width: '260px', height: '100vh', position: 'fixed', borderRight: '1px solid var(--border-glass)' }}
    >
      <div className="sidebar-brand mb-4 px-2 d-flex align-items-center">
        <div className="rounded-circle d-flex justify-content-center align-items-center me-2" style={{ background: 'var(--gradient-brand)', width: '40px', height: '40px', color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
          IS
        </div>
        <h4 className="m-0 text-gradient fw-bold">InternSync</h4>
      </div>

      <Nav className="flex-column flex-grow-1 gap-1">
        {navItems.map((item) => (
          <Nav.Link
            as={NavLink}
            to={item.path}
            key={item.name}
            className="d-flex align-items-center gap-3 px-3 py-2"
          >
            {item.icon}
            <span className="fw-medium">{item.name}</span>
          </Nav.Link>
        ))}
        <Nav.Link
          as={NavLink}
          to="/app/settings"
          className="d-flex align-items-center gap-3 px-3 py-2"
        >
          <Settings size={20} />
          <span className="fw-medium">Settings</span>
        </Nav.Link>
      </Nav>

      <div className="mt-auto">
        <hr style={{ borderColor: 'var(--border-glass)' }} />
        <Nav.Link 
          className="d-flex align-items-center gap-3 px-3 py-2 text-danger logout-btn" 
          onClick={handleLogout}
          style={{ borderRadius: '10px', cursor: 'pointer' }}
        >
          <LogOut size={20} />
          <span className="fw-medium">Logout</span>
        </Nav.Link>
      </div>
    </motion.div>
  );
};

export default Sidebar;
