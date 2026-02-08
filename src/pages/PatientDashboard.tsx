import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <Row className="mb-4 page-header">
        <Col>
          <h1 className="h2 mb-1">Patient Dashboard</h1>
          <p className="text-muted mb-0">
            <i className="bi bi-heart-pulse-fill me-2"></i>
            Welcome, {user?.username}
          </p>
          <div className="mt-2">
            <span className="badge bg-gradient-info">
              <i className="bi bi-person-check-fill me-1"></i>
              Patient Portal
            </span>
          </div>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-soft dashboard-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-primary bg-opacity-10">
                    <i className="bi bi-file-medical text-primary"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medical Records</h6>
                  <h2 className="mb-0 fw-bold">-</h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-soft dashboard-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-success bg-opacity-10">
                    <i className="bi bi-clipboard-pulse text-success"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prescriptions</h6>
                  <h2 className="mb-0 fw-bold">-</h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-soft dashboard-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-info bg-opacity-10">
                    <i className="bi bi-calendar-check text-info"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Appointments</h6>
                  <h2 className="mb-0 fw-bold">-</h2>
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
                      <i className="bi bi-file-earmark-medical me-2"></i>
                      View Medical Records
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
                      <i className="bi bi-prescription2 me-2"></i>
                      View Prescriptions
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
                      <i className="bi bi-calendar-plus me-2"></i>
                      Book Appointment
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
                <i className="bi bi-person-badge me-2 text-primary"></i>
                Profile Information
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

      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-soft border-start border-warning border-4">
            <Card.Body>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <i className="bi bi-shield-fill-check fs-4 text-warning"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-2 fw-semibold">Healthcare Information Privacy Notice</h6>
                  <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                    Your medical information is protected under HIPAA regulations. 
                    All data is encrypted and access is strictly controlled. 
                    Only authorized healthcare providers can view your medical records.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PatientDashboard;
