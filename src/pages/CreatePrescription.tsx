import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { prescriptionService } from '../services/prescription.service';
import { patientService } from '../services/patient.service';
import { doctorService } from '../services/doctor.service';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/apiClient';
import { CreatePrescriptionRequest } from '../types/entities.types';

interface PrescriptionFormData {
  patientId: string;
  medication: string;
  status: string;
}

const CreatePrescription: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preSelectedPatientId = searchParams.get('patientId');
  
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [patientSearch, setPatientSearch] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PrescriptionFormData>({
    defaultValues: {
      patientId: preSelectedPatientId || '',
      status: 'ACTIVE',
    },
  });

  const selectedPatientId = watch('patientId');

  // Fetch doctor info for current user
  const { data: doctor, isLoading: loadingDoctor, error: doctorError } = useQuery({
    queryKey: ['doctor', user?.userId || user?.id],
    queryFn: () => doctorService.getDoctorByUserId((user?.userId || user?.id) || 0),
    enabled: !!(user?.userId || user?.id),
  });

  // Log doctor status for debugging
  useEffect(() => {
    console.log('Doctor loading status:', { 
      loadingDoctor, 
      doctor, 
      doctorError, 
      userId: user?.userId || user?.id,
      fullUser: user 
    });
    if (doctorError) {
      console.error('Error loading doctor:', doctorError);
      setError('Failed to load doctor information. Please refresh the page.');
    }
  }, [doctor, loadingDoctor, doctorError, user]);

  // Fetch all patients
  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAllPatients,
  });

  // Create prescription mutation
  const createMutation = useMutation({
    mutationFn: prescriptionService.createPrescription,
    onSuccess: (data) => {
      console.log('Prescription created successfully:', data);
      setSuccess('Prescription created successfully!');
      setError('');
      setTimeout(() => {
        navigate('/doctor/prescriptions');
      }, 2000);
    },
    onError: (err: any) => {
      console.error('Error creating prescription:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      const errorMessage = getErrorMessage(err);
      console.error('Parsed error message:', errorMessage);
      setError(errorMessage);
      setSuccess('');
    },
  });

  useEffect(() => {
    if (preSelectedPatientId) {
      setValue('patientId', preSelectedPatientId);
    }
  }, [preSelectedPatientId, setValue]);

  // Filter patients based on search term
  const filteredPatients = patients?.filter((patient) => {
    if (!patientSearch) return true;
    const searchLower = patientSearch.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(searchLower) ||
      patient.user.username?.toLowerCase().includes(searchLower) ||
      patient.user.email?.toLowerCase().includes(searchLower) ||
      patient.contactInfo?.toLowerCase().includes(searchLower)
    );
  });

  const onSubmit = async (data: PrescriptionFormData): Promise<void> => {
    console.log('Form submitted with data:', data);
    
    if (!doctor) {
      setError('Doctor information not found. Please try logging in again.');
      return;
    }

    console.log('Doctor found:', doctor);

    // Validate patientId
    if (!data.patientId || data.patientId === '') {
      setError('Please select a patient');
      return;
    }

    const prescriptionRequest: CreatePrescriptionRequest = {
      patient: {
        id: parseInt(data.patientId),
      },
      doctor: {
        id: doctor.id,
      },
      medicationEncrypted: data.medication,
      status: data.status,
    };

    console.log('Sending prescription request:', prescriptionRequest);
    
    try {
      createMutation.mutate(prescriptionRequest);
    } catch (err) {
      console.error('Error creating prescription:', err);
      setError('Failed to create prescription. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <Row className="mb-4 page-header">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="h2 mb-1">Create Prescription</h1>
              <p className="text-muted mb-0">
                <i className="bi bi-file-earmark-medical me-2"></i>
                Issue a new prescription for a patient
              </p>
            </div>
            <Button variant="outline-secondary" onClick={() => navigate(-1)} className="hover-lift">
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-soft">
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Patient <span className="text-danger">*</span>
                  </Form.Label>
                  
                  {/* Search Box */}
                  {!preSelectedPatientId && (
                    <div className="mb-2">
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <i className="bi bi-search"></i>
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Search by name, email, or contact..."
                          value={patientSearch}
                          onChange={(e) => setPatientSearch(e.target.value)}
                          disabled={createMutation.isPending || loadingPatients}
                        />
                        {patientSearch && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setPatientSearch('')}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        )}
                      </div>
                      <Form.Text className="text-muted">
                        {filteredPatients && filteredPatients.length < (patients?.length || 0) && (
                          <span>
                            Showing {filteredPatients.length} of {patients?.length} patients
                          </span>
                        )}
                      </Form.Text>
                    </div>
                  )}

                  {/* Patient Dropdown */}
                  <Form.Select
                    isInvalid={!!errors.patientId}
                    {...register('patientId', {
                      required: 'Please select a patient',
                    })}
                    disabled={createMutation.isPending || loadingPatients || !!preSelectedPatientId}
                    size="lg"
                  >
                    <option value="">Select a patient...</option>
                    {filteredPatients?.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name || patient.user.username} - {patient.user.email}
                        {patient.contactInfo ? ` (${patient.contactInfo})` : ''}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.patientId?.message}
                  </Form.Control.Feedback>
                  {loadingPatients && (
                    <Form.Text className="text-muted">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading patients...
                    </Form.Text>
                  )}
                  {!loadingPatients && filteredPatients?.length === 0 && patientSearch && (
                    <Form.Text className="text-warning">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      No patients found matching "{patientSearch}"
                    </Form.Text>
                  )}
                  {selectedPatientId && patients && (
                    <div className="mt-2 p-2 bg-light rounded">
                      <small className="text-muted">
                        <i className="bi bi-person-check-fill me-1 text-success"></i>
                        Selected: {patients.find(p => p.id === parseInt(selectedPatientId))?.name || 
                                  patients.find(p => p.id === parseInt(selectedPatientId))?.user.username}
                      </small>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Medication Details <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Enter medication details, dosage, frequency, duration, and special instructions..."
                    isInvalid={!!errors.medication}
                    {...register('medication', {
                      required: 'Medication details are required',
                      minLength: {
                        value: 10,
                        message: 'Please provide detailed medication information (minimum 10 characters)',
                      },
                    })}
                    disabled={createMutation.isPending}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.medication?.message}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Include: medication name, dosage, frequency, duration, and any special instructions
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    Status <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    isInvalid={!!errors.status}
                    {...register('status', {
                      required: 'Please select a status',
                    })}
                    disabled={createMutation.isPending}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.status?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  {loadingDoctor && (
                    <Alert variant="info">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading doctor information...
                    </Alert>
                  )}
                  {doctorError && (
                    <Alert variant="danger">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Failed to load doctor information. Please refresh the page.
                    </Alert>
                  )}
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={createMutation.isPending || !doctor || loadingPatients || loadingDoctor}
                  >
                    {createMutation.isPending ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Creating Prescription...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-prescription2 me-2"></i>
                        Create Prescription
                      </>
                    )}
                  </Button>
                  {!doctor && !loadingDoctor && (
                    <small className="text-danger text-center">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      Doctor information not found. Please log in again.
                    </small>
                  )}
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                    disabled={createMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mt-4 bg-warning bg-opacity-10 border-warning border-start border-4">
            <Card.Body>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <i className="bi bi-shield-lock fs-3 text-warning"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-2">Protected Health Information (PHI)</h6>
                  <p className="small text-muted mb-0">
                    This prescription will be encrypted and stored securely in compliance with HIPAA regulations. 
                    Only authorized healthcare providers and the patient can access this information.
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

export default CreatePrescription;
