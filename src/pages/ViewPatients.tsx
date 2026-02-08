import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../services/patient.service';
import { getErrorMessage } from '../utils/apiClient';
import CreatePrescriptionModal from '../components/CreatePrescriptionModal';

const ViewPatients: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>(undefined);

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAllPatients,
  });

  const filteredPatients = patients?.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(searchLower) ||
      patient.user.email?.toLowerCase().includes(searchLower) ||
      patient.contactInfo?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateAge = (dob: string | null): string => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  return (
    <div className="p-4">
      <Row className="mb-4 page-header">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="h2 mb-1">My Patients</h1>
              <p className="text-muted mb-0">
                <i className="bi bi-people-fill me-2"></i>
                View and manage patient information
              </p>
            </div>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
              className="hover-lift"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {getErrorMessage(error)}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={6}>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white">
              <i className="bi bi-search text-primary"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name, email, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
            {searchTerm && (
              <Button 
                variant="outline-secondary" 
                onClick={() => setSearchTerm('')}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-soft">
            <Card.Body>
              {isLoading ? (
                <div className="loading-state">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted">Loading patients...</p>
                </div>
              ) : !filteredPatients || filteredPatients.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-people"></i>
                  <p className="text-muted">
                    {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
                  </p>
                  <Button variant="primary" onClick={() => navigate(-1)} className="hover-lift mt-2">
                    <i className="bi bi-arrow-left me-2"></i>
                    Go Back
                  </Button>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 fw-semibold">
                      <i className="bi bi-list-ul me-2 text-primary"></i>
                      Patient List
                      <span className="badge bg-gradient-primary ms-2">
                        {filteredPatients.length}
                      </span>
                    </h5>
                  </div>
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center" style={{ width: '80px' }}>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Date of Birth</th>
                          <th>Age</th>
                          <th>Contact</th>
                          <th className="text-center" style={{ width: '150px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((patient) => (
                          <tr key={patient.id}>
                            <td className="text-center">
                              <span className="badge bg-gradient-secondary">#{patient.id}</span>
                            </td>
                            <td>
                              <div>
                                <div className="fw-semibold">{patient.name || 'N/A'}</div>
                                <small className="text-muted">
                                  <i className="bi bi-person-circle me-1"></i>
                                  {patient.user.username}
                                </small>
                              </div>
                            </td>
                            <td>
                              <small>
                                <i className="bi bi-envelope me-1 text-muted"></i>
                                {patient.user.email}
                              </small>
                            </td>
                            <td>
                              <small>
                                <i className="bi bi-calendar3 me-1 text-muted"></i>
                                {formatDate(patient.dob)}
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">
                                {calculateAge(patient.dob)}
                              </span>
                            </td>
                            <td>
                              <small>
                                <i className="bi bi-telephone me-1 text-muted"></i>
                                {patient.contactInfo || 'N/A'}
                              </small>
                            </td>
                            <td className="text-center">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedPatientId(patient.id);
                                  setShowPrescriptionModal(true);
                                }}
                                className="hover-lift"
                              >
                                <i className="bi bi-prescription2 me-1"></i>
                                Prescribe
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {patients && patients.length > 0 && (
        <Row className="g-4 mt-1">
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
                    <h2 className="mb-0 fw-bold">{patients.length}</h2>
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
                      <i className="bi bi-calendar-check text-success"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>With DOB</h6>
                    <h2 className="mb-0 fw-bold">{patients.filter((p) => p.dob).length}</h2>
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
                      <i className="bi bi-telephone text-info"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>With Contact</h6>
                    <h2 className="mb-0 fw-bold">{patients.filter((p) => p.contactInfo).length}</h2>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Create Prescription Modal */}
      <CreatePrescriptionModal
        show={showPrescriptionModal}
        onHide={() => {
          setShowPrescriptionModal(false);
          setSelectedPatientId(undefined);
        }}
        preSelectedPatientId={selectedPatientId}
      />
    </div>
  );
};

export default ViewPatients;
