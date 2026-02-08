import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">Patient Dashboard</h1>
          <p className="text-muted">Welcome, {user?.username}</p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 rounded p-3">
                    <i className="bi bi-file-medical fs-3 text-primary"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Medical Records</h6>
                  <h3 className="mb-0">-</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 rounded p-3">
                    <i className="bi bi-clipboard-pulse fs-3 text-success"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Prescriptions</h6>
                  <h3 className="mb-0">-</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 rounded p-3">
                    <i className="bi bi-calendar-check fs-3 text-info"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Appointments</h6>
                  <h3 className="mb-0">-</h3>
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
                      <i className="bi bi-file-earmark-medical me-2"></i>
                      View Medical Records
                    </button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-prescription2 me-2"></i>
                      View Prescriptions
                    </button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-calendar-plus me-2"></i>
                      Book Appointment
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
              <h5 className="card-title mb-3">Profile Information</h5>
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

      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm border-start border-warning border-4">
            <Card.Body>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <i className="bi bi-info-circle fs-4 text-warning"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-2">Healthcare Information Privacy Notice</h6>
                  <p className="small text-muted mb-0">
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
