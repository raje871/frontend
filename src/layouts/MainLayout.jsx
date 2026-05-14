import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const MainLayout = () => {
  return (
    <div className="d-flex" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '280px', overflowX: 'hidden' }}>
        <TopNavbar />
        <div className="p-4" style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
