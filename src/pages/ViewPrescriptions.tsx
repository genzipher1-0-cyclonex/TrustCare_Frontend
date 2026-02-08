import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Alert, Badge, Form, InputGroup } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { prescriptionService } from '../services/prescription.service';
import { doctorService } from '../services/doctor.service';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/apiClient';

const ViewPrescriptions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Fetch doctor info for current user (auto-creates if doesn't exist)
  const { data: doctor } = useQuery({
    queryKey: ['myDoctor'],
    queryFn: () => doctorService.getMyDoctorRecord(),
    enabled: !!user,
  });

  // Fetch prescriptions for this doctor
  const { data: prescriptions, isLoading, error } = useQuery({
    queryKey: ['prescriptions', doctor?.id],
    queryFn: () => prescriptionService.getPrescriptionsByDoctorId(doctor?.id || 0),
    enabled: !!doctor?.id,
  });

  const filteredPrescriptions = prescriptions?.filter((prescription) => {
    const matchesSearch = searchTerm
      ? prescription.patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patient.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medicationEncrypted?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus = statusFilter === 'ALL' || prescription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string): JSX.Element => {
    const variants: Record<string, string> = {
      ACTIVE: 'success',
      PENDING: 'warning',
      COMPLETED: 'info',
      CANCELLED: 'secondary',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getStatusCounts = () => {
    if (!prescriptions) return { total: 0, active: 0, pending: 0, completed: 0, cancelled: 0 };
    return {
      total: prescriptions.length,
      active: prescriptions.filter((p) => p.status === 'ACTIVE').length,
      pending: prescriptions.filter((p) => p.status === 'PENDING').length,
      completed: prescriptions.filter((p) => p.status === 'COMPLETED').length,
      cancelled: prescriptions.filter((p) => p.status === 'CANCELLED').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">My Prescriptions</h1>
              <p className="text-muted">View and manage prescriptions you've issued</p>
            </div>
            <div>
              <Button variant="primary" onClick={() => navigate('/doctor/prescriptions/new')} className="me-2">
                <i className="bi bi-plus-lg me-2"></i>
                New Prescription
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </Button>
            </div>
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
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
                <i className="bi bi-prescription2 fs-2 text-primary"></i>
              </div>
              <div>
                <h3 className="mb-0">{counts.total}</h3>
                <p className="text-muted mb-0">Total Prescriptions</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                <i className="bi bi-check-circle fs-2 text-success"></i>
              </div>
              <div>
                <h3 className="mb-0">{counts.active}</h3>
                <p className="text-muted mb-0">Active</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 rounded p-3 me-3">
                <i className="bi bi-clock-history fs-2 text-warning"></i>
              </div>
              <div>
                <h3 className="mb-0">{counts.pending}</h3>
                <p className="text-muted mb-0">Pending</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by patient name, email, or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-3">Loading prescriptions...</p>
                </div>
              ) : !filteredPrescriptions || filteredPrescriptions.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-prescription2 fs-1 text-muted"></i>
                  <p className="text-muted mt-3">
                    {searchTerm || statusFilter !== 'ALL'
                      ? 'No prescriptions found matching your filters.'
                      : 'No prescriptions found. Create your first prescription!'}
                  </p>
                  <Button variant="primary" onClick={() => navigate('/doctor/prescriptions/new')}>
                    <i className="bi bi-plus-lg me-2"></i>
                    Create Prescription
                  </Button>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      Prescription List ({filteredPrescriptions.length}{' '}
                      {filteredPrescriptions.length === 1 ? 'prescription' : 'prescriptions'})
                    </h5>
                  </div>
                  <div className="table-responsive">
                    <Table hover>
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Patient</th>
                          <th>Medication</th>
                          <th>Issued At</th>
                          <th>Status</th>
                          <th>Request ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPrescriptions.map((prescription) => (
                          <tr key={prescription.id}>
                            <td className="align-middle">
                              <span className="badge bg-secondary">#{prescription.id}</span>
                            </td>
                            <td className="align-middle">
                              <div>
                                <strong>{prescription.patient.name || 'N/A'}</strong>
                                <br />
                                <small className="text-muted">
                                  {prescription.patient.user.email}
                                </small>
                              </div>
                            </td>
                            <td className="align-middle">
                              <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                {prescription.medicationEncrypted}
                              </div>
                            </td>
                            <td className="align-middle">
                              <small>{formatDate(prescription.issuedAt)}</small>
                            </td>
                            <td className="align-middle">{getStatusBadge(prescription.status)}</td>
                            <td className="align-middle">
                              {prescription.requestId ? (
                                <span className="badge bg-info">{prescription.requestId}</span>
                              ) : (
                                <span className="text-muted">N/A</span>
                              )}
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
    </div>
  );
};

export default ViewPrescriptions;
