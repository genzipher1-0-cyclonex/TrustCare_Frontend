import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = (): void => {
    logout();
  };

  const getNavigationItems = (): NavItem[] => {
    const role = user?.role?.roleName;

    if (role === 'ADMIN') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        { path: '/admin/users', label: 'Users', icon: 'bi-people' },
        { path: '/admin/roles', label: 'Roles', icon: 'bi-shield-lock' },
        { path: '/admin/reports', label: 'Reports', icon: 'bi-bar-chart' },
        { path: '/admin/settings', label: 'Settings', icon: 'bi-gear' },
      ];
    } else if (role === 'DOCTOR') {
      return [
        { path: '/doctor/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        { path: '/doctor/patients', label: 'Patients', icon: 'bi-people' },
        { path: '/doctor/prescriptions', label: 'Prescriptions', icon: 'bi-clipboard2-pulse' },
        { path: '/doctor/prescriptions/new', label: 'New Prescription', icon: 'bi-prescription2' },
        { path: '/doctor/appointments', label: 'Appointments', icon: 'bi-calendar-check' },
      ];
    } else if (role === 'PATIENT') {
      return [
        { path: '/patient/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        { path: '/patient/appointments', label: 'My Appointments', icon: 'bi-calendar-check' },
        { path: '/patient/prescriptions', label: 'My Prescriptions', icon: 'bi-prescription2' },
        { path: '/patient/records', label: 'Medical Records', icon: 'bi-file-medical' },
        { path: '/patient/profile', label: 'Profile', icon: 'bi-person' },
      ];
    }

    return [];
  };

  const navItems = getNavigationItems();

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string): void => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 992) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={() => setSidebarCollapsed(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1040,
          }}
        />
      )}
      {/* Top Navbar */}
      <Navbar bg="white" className="shadow-sm border-bottom sticky-top">
        <Container fluid>
          <button
            className="btn btn-link text-dark p-0 me-3 d-lg-none"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          <Navbar.Brand className="fw-bold text-primary mb-0">
            <i className="bi bi-hospital me-2"></i>
            TrustCare
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center">
            <Nav.Link className="position-relative me-2">
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                3
              </span>
            </Nav.Link>
            <NavDropdown
              title={
                <span>
                  <i className="bi bi-person-circle fs-5 me-2"></i>
                  <span className="d-none d-md-inline">{user?.username}</span>
                </span>
              }
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.ItemText>
                <div className="small text-muted">{user?.email}</div>
                <div>
                  <span className="badge bg-primary mt-1">{user?.role?.roleName}</span>
                </div>
              </NavDropdown.ItemText>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => navigate(`/${user?.role?.roleName.toLowerCase()}/dashboard`)}>
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </NavDropdown.Item>
              <NavDropdown.Item>
                <i className="bi bi-person me-2"></i>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item>
                <i className="bi bi-gear me-2"></i>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className={`bg-dark text-white sidebar d-flex flex-column ${
            sidebarCollapsed ? 'd-none' : 'd-flex'
          } d-lg-flex`}
          style={{
            width: '250px',
            minHeight: '100%',
            position: 'sticky',
            top: '56px',
            height: 'calc(100vh - 56px)',
            overflowY: 'auto',
            zIndex: 1050,
          }}
        >
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-person fs-5"></i>
              </div>
              <div className="flex-grow-1">
                <div className="fw-semibold small">{user?.username}</div>
                <div className="text-muted small">{user?.role?.roleName}</div>
              </div>
            </div>
          </div>

          <nav className="flex-grow-1 p-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`btn w-100 text-start mb-1 d-flex align-items-center sidebar-nav-item ${
                  isActiveRoute(item.path)
                    ? 'btn-primary active'
                    : 'btn-link text-white text-decoration-none'
                }`}
                style={{
                  borderRadius: '0.375rem',
                  padding: '0.625rem 1rem',
                }}
              >
                <i className={`bi ${item.icon} me-3 fs-5`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-3 border-top border-secondary">
            <div className="small text-muted mb-2">System Status</div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="small">Server</span>
              <span className="badge bg-success">
                <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 'calc(100vh - 56px)' }}>
          <main className="flex-grow-1 bg-light">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-white border-top py-3 mt-auto">
            <Container fluid>
              <div className="row align-items-center">
                <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
                  <p className="small text-muted mb-0">
                    &copy; 2026 TrustCare Hospital Management System. All rights reserved.
                  </p>
                </div>
                <div className="col-md-6 text-center text-md-end">
                  <span className="badge bg-success me-2">
                    <i className="bi bi-shield-check me-1"></i>
                    HIPAA Compliant
                  </span>
                  <span className="badge bg-info me-2">
                    <i className="bi bi-lock me-1"></i>
                    Secure
                  </span>
                  <span className="badge bg-primary">
                    <i className="bi bi-patch-check me-1"></i>
                    Encrypted
                  </span>
                </div>
              </div>
            </Container>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
