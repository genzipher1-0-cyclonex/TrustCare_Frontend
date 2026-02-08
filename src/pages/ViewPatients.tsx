import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../services/patient.service';
import { getErrorMessage } from '../utils/apiClient';

const ViewPatients: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

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
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">My Patients</h1>
              <p className="text-muted">View and manage patient information</p>
            </div>
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
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
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name, email, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-3">Loading patients...</p>
                </div>
              ) : !filteredPatients || filteredPatients.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-people fs-1 text-muted"></i>
                  <p className="text-muted mt-3">
                    {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      Patient List ({filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'})
                    </h5>
                  </div>
                  <div className="table-responsive">
                    <Table hover>
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Date of Birth</th>
                          <th>Age</th>
                          <th>Contact</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((patient) => (
                          <tr key={patient.id}>
                            <td className="align-middle">
                              <span className="badge bg-secondary">#{patient.id}</span>
                            </td>
                            <td className="align-middle">
                              <div>
                                <strong>{patient.name || 'N/A'}</strong>
                                <br />
                                <small className="text-muted">@{patient.user.username}</small>
                              </div>
                            </td>
                            <td className="align-middle">{patient.user.email}</td>
                            <td className="align-middle">{formatDate(patient.dob)}</td>
                            <td className="align-middle">{calculateAge(patient.dob)}</td>
                            <td className="align-middle">{patient.contactInfo || 'N/A'}</td>
                            <td className="align-middle">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/doctor/prescriptions/new?patientId=${patient.id}`)}
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
        <Row className="mt-4">
          <Col>
            <Card className="border-0 shadow-sm bg-light">
              <Card.Body>
                <Row>
                  <Col md={4} className="text-center">
                    <div className="bg-primary bg-opacity-10 rounded p-3 d-inline-block mb-2">
                      <i className="bi bi-people fs-2 text-primary"></i>
                    </div>
                    <h4>{patients.length}</h4>
                    <p className="text-muted mb-0">Total Patients</p>
                  </Col>
                  <Col md={4} className="text-center">
                    <div className="bg-success bg-opacity-10 rounded p-3 d-inline-block mb-2">
                      <i className="bi bi-calendar-check fs-2 text-success"></i>
                    </div>
                    <h4>{patients.filter((p) => p.dob).length}</h4>
                    <p className="text-muted mb-0">With DOB</p>
                  </Col>
                  <Col md={4} className="text-center">
                    <div className="bg-info bg-opacity-10 rounded p-3 d-inline-block mb-2">
                      <i className="bi bi-telephone fs-2 text-info"></i>
                    </div>
                    <h4>{patients.filter((p) => p.contactInfo).length}</h4>
                    <p className="text-muted mb-0">With Contact Info</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ViewPatients;
