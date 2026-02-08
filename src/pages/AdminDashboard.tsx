import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">Admin Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.username}</p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 rounded p-3">
                    <i className="bi bi-people fs-3 text-primary"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <h3 className="mb-0">-</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 rounded p-3">
                    <i className="bi bi-shield-check fs-3 text-success"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Active Roles</h6>
                  <h3 className="mb-0">-</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 rounded p-3">
                    <i className="bi bi-file-text fs-3 text-warning"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Audit Logs</h6>
                  <h3 className="mb-0">-</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 rounded p-3">
                    <i className="bi bi-activity fs-3 text-info"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">System Health</h6>
                  <h3 className="mb-0 text-success">Active</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Quick Actions</h5>
              <Row className="g-3">
                <Col md={4}>
                  <div className="d-grid">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-person-plus me-2"></i>
                      Manage Users
                    </button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-shield me-2"></i>
                      View Permissions
                    </button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-clock-history me-2"></i>
                      Audit Logs
                    </button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3">System Information</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td className="text-muted">Email:</td>
                      <td className="fw-semibold">{user?.email}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Role:</td>
                      <td>
                        <span className="badge bg-primary">{user?.role?.roleName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Status:</td>
                      <td>
                        <span className="badge bg-success">{user?.status}</span>
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
