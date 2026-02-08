import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Alert, Badge, Form, InputGroup } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { prescriptionService } from '../services/prescription.service';
import { doctorService } from '../services/doctor.service';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/apiClient';
import CreatePrescriptionModal from '../components/CreatePrescriptionModal';

const ViewPrescriptions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Fetch doctor info for current user
  const { data: doctor } = useQuery({
    queryKey: ['doctor', user?.userId || user?.id],
    queryFn: () => doctorService.getDoctorByUserId((user?.userId || user?.id) || 0),
    enabled: !!(user?.userId || user?.id),
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
      <Row className="mb-4 page-header">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="h2 mb-1">My Prescriptions</h1>
              <p className="text-muted mb-0">
                <i className="bi bi-prescription2 me-2"></i>
                View and manage prescriptions you've issued
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => setShowPrescriptionModal(true)} className="hover-lift">
                <i className="bi bi-plus-lg me-2"></i>
                New Prescription
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)} className="hover-lift">
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

      <Row className="g-4 mb-4">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-soft dashboard-card h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="stats-icon bg-primary bg-opacity-10">
                    <i className="bi bi-prescription2 text-primary"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Prescriptions</h6>
                  <h2 className="mb-0 fw-bold">{counts.total}</h2>
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
                    <i className="bi bi-check-circle text-success"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active</h6>
                  <h2 className="mb-0 fw-bold">{counts.active}</h2>
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
                  <div className="stats-icon bg-warning bg-opacity-10">
                    <i className="bi bi-clock-history text-warning"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</h6>
                  <h2 className="mb-0 fw-bold">{counts.pending}</h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white">
              <i className="bi bi-search text-primary"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by patient name, email, or medication..."
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
        <Col md={3}>
          <Form.Select size="lg" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
          <Card className="border-0 shadow-soft">
            <Card.Body>
              {isLoading ? (
                <div className="loading-state">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted">Loading prescriptions...</p>
                </div>
              ) : !filteredPrescriptions || filteredPrescriptions.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-prescription2"></i>
                  <p className="text-muted">
                    {searchTerm || statusFilter !== 'ALL'
                      ? 'No prescriptions found matching your filters.'
                      : 'No prescriptions found. Create your first prescription!'}
                  </p>
                  <Button variant="primary" onClick={() => setShowPrescriptionModal(true)} className="hover-lift">
                    <i className="bi bi-plus-lg me-2"></i>
                    Create Prescription
                  </Button>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 fw-semibold">
                      <i className="bi bi-list-ul me-2 text-primary"></i>
                      Prescription List
                      <span className="badge bg-gradient-primary ms-2">
                        {filteredPrescriptions.length}
                      </span>
                    </h5>
                  </div>
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center" style={{ width: '80px' }}>ID</th>
                          <th>Patient</th>
                          <th>Medication</th>
                          <th>Issued At</th>
                          <th className="text-center" style={{ width: '120px' }}>Status</th>
                          <th className="text-center" style={{ width: '100px' }}>Request ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPrescriptions.map((prescription) => (
                          <tr key={prescription.id}>
                            <td className="text-center">
                              <span className="badge bg-gradient-secondary">#{prescription.id}</span>
                            </td>
                            <td>
                              <div>
                                <div className="fw-semibold">{prescription.patient.name || 'N/A'}</div>
                                <small className="text-muted">
                                  <i className="bi bi-envelope me-1"></i>
                                  {prescription.patient.user.email}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                <i className="bi bi-capsule me-2 text-primary"></i>
                                {prescription.medicationEncrypted}
                              </div>
                            </td>
                            <td>
                              <small>
                                <i className="bi bi-calendar3 me-1 text-muted"></i>
                                {formatDate(prescription.issuedAt)}
                              </small>
                            </td>
                            <td className="text-center">{getStatusBadge(prescription.status)}</td>
                            <td className="text-center">
                              {prescription.requestId ? (
                                <span className="badge bg-gradient-info">{prescription.requestId}</span>
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

      {/* Create Prescription Modal */}
      <CreatePrescriptionModal
        show={showPrescriptionModal}
        onHide={() => setShowPrescriptionModal(false)}
      />
    </div>
  );
};

export default ViewPrescriptions;
