import React from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { doctorService } from '../services/doctor.service';
import { patientService } from '../services/patient.service';
import { prescriptionService } from '../services/prescription.service';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch doctor info for current user (auto-creates if doesn't exist)
  const { data: doctor } = useQuery({
    queryKey: ['myDoctor'],
    queryFn: () => doctorService.getMyDoctorRecord(),
    enabled: !!user,
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
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">Doctor Dashboard</h1>
          <p className="text-muted">Welcome back, Dr. {doctorName}</p>
          {doctor?.specialization && (
            <p className="text-muted small mb-0">
              <i className="bi bi-award me-2"></i>
              Specialization: {doctor.specialization}
            </p>
          )}
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 rounded p-3">
                    <i className="bi bi-people fs-3 text-primary"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">My Patients</h6>
                  <h3 className="mb-0">
                    {loadingPatients ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      patients?.length || 0
                    )}
                  </h3>
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
                  <h3 className="mb-0">
                    {loadingPrescriptions ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      prescriptions?.length || 0
                    )}
                  </h3>
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
                    <i className="bi bi-file-medical fs-3 text-info"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Active Prescriptions</h6>
                  <h3 className="mb-0">
                    {loadingPrescriptions ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      prescriptions?.filter((p) => p.status === 'ACTIVE').length || 0
                    )}
                  </h3>
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
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate('/doctor/patients')}
                    >
                      <i className="bi bi-person-lines-fill me-2"></i>
                      View Patients
                    </Button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate('/doctor/prescriptions')}
                    >
                      <i className="bi bi-clipboard2-pulse me-2"></i>
                      View Prescriptions
                    </Button>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate('/doctor/prescriptions/new')}
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
    </div>
  );
};

export default DoctorDashboard;
