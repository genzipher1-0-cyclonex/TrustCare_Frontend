import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <Row className="mb-4 page-header">
        <Col>
          <h1 className="h2 mb-1">Admin Dashboard</h1>
          <p className="text-muted mb-0">
            <i className="bi bi-shield-fill-check me-2"></i>
            Welcome back, {user?.username}
          </p>
          <div className="mt-2">
            <span className="badge bg-gradient-danger">
              <i className="bi bi-star-fill me-1"></i>
              System Administrator
            </span>
          </div>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-soft dashboard-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-primary bg-opacity-10">
                    <i className="bi bi-people text-primary"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Users</h6>
                  <h2 className="mb-0 fw-bold">-</h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-soft dashboard-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-success bg-opacity-10">
                    <i className="bi bi-shield-check text-success"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Roles</h6>
                  <h2 className="mb-0 fw-bold">3</h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-soft dashboard-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-warning bg-opacity-10">
                    <i className="bi bi-file-text text-warning"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Audit Logs</h6>
                  <h2 className="mb-0 fw-bold">-</h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-soft dashboard-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-info bg-opacity-10">
                    <i className="bi bi-activity text-info"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>System</h6>
                  <h2 className="mb-0 fw-bold text-success">
                    <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.75rem' }}></i>
                    Active
                  </h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="border-0 shadow-soft">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">
                  <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <Row className="g-3">
                <Col md={4}>
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      size="lg"
                      className="hover-lift"
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      Manage Users
                    </Button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <Button
                      variant="success"
                      size="lg"
                      className="hover-lift"
                    >
                      <i className="bi bi-shield me-2"></i>
                      View Permissions
                    </Button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <Button
                      variant="info"
                      size="lg"
                      className="hover-lift"
                    >
                      <i className="bi bi-clock-history me-2"></i>
                      Audit Logs
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-soft">
            <Card.Body>
              <h5 className="card-title mb-4">
                <i className="bi bi-gear-fill me-2 text-primary"></i>
                System Information
              </h5>
              <div className="table-responsive">
                <table className="table table-borderless table-sm mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted fw-semibold" style={{ width: '140px' }}>
                        <i className="bi bi-envelope me-2"></i>Email:
                      </td>
                      <td className="fw-semibold">{user?.email}</td>
                    </tr>
                    <tr>
                      <td className="text-muted fw-semibold">
                        <i className="bi bi-shield-check me-2"></i>Role:
                      </td>
                      <td>
                        <span className="badge bg-gradient-primary">{user?.role?.roleName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted fw-semibold">
                        <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.5rem' }}></i>Status:
                      </td>
                      <td>
                        <span className="badge bg-gradient-success">
                          <i className="bi bi-check-circle me-1"></i>
                          {user?.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
