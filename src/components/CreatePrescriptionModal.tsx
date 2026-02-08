import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

interface CreatePrescriptionModalProps {
  show: boolean;
  onHide: () => void;
  preSelectedPatientId?: number;
  onSuccess?: () => void;
}

const CreatePrescriptionModal: React.FC<CreatePrescriptionModalProps> = ({
  show,
  onHide,
  preSelectedPatientId,
  onSuccess,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [patientSearch, setPatientSearch] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PrescriptionFormData>({
    defaultValues: {
      patientId: preSelectedPatientId?.toString() || '',
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
      
      // Invalidate and refetch prescriptions
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      
      setTimeout(() => {
        handleClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    },
    onError: (err: any) => {
      console.error('Error creating prescription:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setSuccess('');
    },
  });

  useEffect(() => {
    if (preSelectedPatientId) {
      setValue('patientId', preSelectedPatientId.toString());
    }
  }, [preSelectedPatientId, setValue]);

  useEffect(() => {
    if (!show) {
      // Reset form when modal closes
      reset();
      setError('');
      setSuccess('');
      setPatientSearch('');
    }
  }, [show, reset]);

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

  const handleClose = () => {
    if (!createMutation.isPending) {
      onHide();
    }
  };

  const onSubmit = async (data: PrescriptionFormData): Promise<void> => {
    console.log('Form submitted with data:', data);
    
    if (!doctor) {
      setError('Doctor information not found. Please try logging in again.');
      return;
    }

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
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg"
      centered
      backdrop={createMutation.isPending ? 'static' : true}
      keyboard={!createMutation.isPending}
    >
      <Modal.Header closeButton={!createMutation.isPending} className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div className="d-flex align-items-center">
            <div className="stats-icon bg-primary bg-opacity-10 me-3" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-prescription2 text-primary" style={{ fontSize: '1.5rem' }}></i>
            </div>
            <div>
              <h5 className="mb-1 fw-bold">Create Prescription</h5>
              <p className="text-muted mb-0 small">
                <i className="bi bi-file-earmark-medical me-1"></i>
                Issue a new prescription for a patient
              </p>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-3">
            <i className="bi bi-check-circle me-2"></i>
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <i className="bi bi-person-circle me-2 text-primary"></i>
              Patient <span className="text-danger">*</span>
            </Form.Label>
            
            {/* Search Box */}
            {!preSelectedPatientId && (
              <div className="mb-2">
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <i className="bi bi-search text-primary"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, or contact..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    disabled={createMutation.isPending || loadingPatients}
                  />
                  {patientSearch && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setPatientSearch('')}
                      disabled={createMutation.isPending}
                    >
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  )}
                </InputGroup>
                {filteredPatients && filteredPatients.length < (patients?.length || 0) && (
                  <Form.Text className="text-muted">
                    Showing {filteredPatients.length} of {patients?.length} patients
                  </Form.Text>
                )}
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
              className="shadow-sm"
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
              <div className="mt-2 p-2 bg-light rounded border">
                <small className="text-muted">
                  <i className="bi bi-person-check-fill me-1 text-success"></i>
                  Selected: <strong>{patients.find(p => p.id === parseInt(selectedPatientId))?.name || 
                            patients.find(p => p.id === parseInt(selectedPatientId))?.user.username}</strong>
                </small>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <i className="bi bi-capsule me-2 text-primary"></i>
              Medication Details <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
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
              className="shadow-sm"
            />
            <Form.Control.Feedback type="invalid">
              {errors.medication?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Include: medication name, dosage, frequency, duration, and any special instructions
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <i className="bi bi-clipboard-check me-2 text-primary"></i>
              Status <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              isInvalid={!!errors.status}
              {...register('status', {
                required: 'Please select a status',
              })}
              disabled={createMutation.isPending}
              className="shadow-sm"
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

          {/* HIPAA Notice */}
          <div className="alert alert-warning bg-warning bg-opacity-10 border-warning border-start border-3 mb-3">
            <div className="d-flex align-items-start">
              <i className="bi bi-shield-lock fs-5 text-warning me-2 mt-1"></i>
              <div>
                <h6 className="mb-1 fw-semibold">Protected Health Information (PHI)</h6>
                <p className="small text-muted mb-0">
                  This prescription will be encrypted and stored securely in compliance with HIPAA regulations.
                </p>
              </div>
            </div>
          </div>

          {loadingDoctor && (
            <Alert variant="info" className="mb-3">
              <Spinner animation="border" size="sm" className="me-2" />
              Loading doctor information...
            </Alert>
          )}
          {doctorError && (
            <Alert variant="danger" className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Failed to load doctor information. Please refresh the page.
            </Alert>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={createMutation.isPending}
          className="px-4"
        >
          <i className="bi bi-x-lg me-2"></i>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={createMutation.isPending || !doctor || loadingPatients || loadingDoctor}
          className="px-4 hover-lift"
        >
          {createMutation.isPending ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />
              Creating...
            </>
          ) : (
            <>
              <i className="bi bi-prescription2 me-2"></i>
              Create Prescription
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePrescriptionModal;
