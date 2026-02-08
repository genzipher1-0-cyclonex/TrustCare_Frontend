import React, { useState } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { doctorService } from '../services/doctor.service';
import { patientService } from '../services/patient.service';
import { prescriptionService } from '../services/prescription.service';
import CreatePrescriptionModal from '../components/CreatePrescriptionModal';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Fetch doctor info for current user
  const { data: doctor } = useQuery({
    queryKey: ['doctor', user?.userId || user?.id],
    queryFn: () => doctorService.getDoctorByUserId((user?.userId || user?.id) || 0),
    enabled: !!(user?.userId || user?.id),
  });

  // Fetch all patients
  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAllPatients,
  });

  // Fetch prescriptions for this doctor
  const { data: prescriptions, isLoading: loadingPrescriptions } = useQuery({
    queryKey: ['prescriptions', doctor?.id],
    queryFn: () => prescriptionService.getPrescriptionsByDoctorId(doctor?.id || 0),
    enabled: !!doctor?.id,
  });

  const doctorName = doctor?.name || user?.username;

  return (
    <div className="p-4">
      <Row className="mb-4 page-header">
        <Col>
          <h1 className="h2 mb-1">Doctor Dashboard</h1>
          <p className="text-muted mb-0">
            <i className="bi bi-hand-wave me-2"></i>
            Welcome back, Dr. {doctorName}
          </p>
          {doctor?.specialization && (
            <div className="mt-2">
              <span className="badge bg-gradient-primary">
                <i className="bi bi-award me-1"></i>
                {doctor.specialization}
              </span>
            </div>
          )}
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-soft dashboard-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-primary bg-opacity-10">
                    <i className="bi bi-people text-primary"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Patients</h6>
                  <h2 className="mb-0 fw-bold">
                    {loadingPatients ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <span className="d-flex align-items-baseline">
                        {patients?.length || 0}
                        <small className="text-muted ms-2 fw-normal" style={{ fontSize: '0.875rem' }}>registered</small>
                      </span>
                    )}
                  </h2>
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
                  <h2 className="mb-0 fw-bold">
                    {loadingPrescriptions ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <span className="d-flex align-items-baseline">
                        {prescriptions?.length || 0}
                        <small className="text-muted ms-2 fw-normal" style={{ fontSize: '0.875rem' }}>total</small>
                      </span>
                    )}
                  </h2>
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
                    <i className="bi bi-file-medical text-info"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Rx</h6>
                  <h2 className="mb-0 fw-bold">
                    {loadingPrescriptions ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <span className="d-flex align-items-baseline">
                        {prescriptions?.filter((p) => p.status === 'ACTIVE').length || 0}
                        <small className="text-muted ms-2 fw-normal" style={{ fontSize: '0.875rem' }}>active</small>
                      </span>
                    )}
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
                      onClick={() => navigate('/doctor/patients')}
                      className="hover-lift"
                    >
                      <i className="bi bi-person-lines-fill me-2"></i>
                      View Patients
                    </Button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => navigate('/doctor/prescriptions')}
                      className="hover-lift"
                    >
                      <i className="bi bi-clipboard2-pulse me-2"></i>
                      View Prescriptions
                    </Button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <Button
                      variant="info"
                      size="lg"
                      onClick={() => setShowPrescriptionModal(true)}
                      className="hover-lift"
                    >
                      <i className="bi bi-prescription2 me-2"></i>
                      New Prescription
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Prescription Modal */}
      <CreatePrescriptionModal
        show={showPrescriptionModal}
        onHide={() => setShowPrescriptionModal(false)}
      />

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
    </div>
  );
};

export default DoctorDashboard;
