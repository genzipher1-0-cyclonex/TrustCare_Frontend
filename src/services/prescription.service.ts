import apiClient from '../utils/apiClient';
import { Prescription, CreatePrescriptionRequest } from '../types/entities.types';

const PRESCRIPTION_BASE_URL = '/api/prescriptions';

export const prescriptionService = {
  // Create new prescription (Doctor only)
  createPrescription: async (prescription: CreatePrescriptionRequest): Promise<Prescription> => {
    const response = await apiClient.post<Prescription>(`${PRESCRIPTION_BASE_URL}`, prescription);
    return response.data;
  },

  // Get all prescriptions (Admin and Doctor)
  getAllPrescriptions: async (): Promise<Prescription[]> => {
    const response = await apiClient.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}`);
    return response.data;
  },

  // Get prescription by ID
  getPrescriptionById: async (id: number): Promise<Prescription> => {
    const response = await apiClient.get<Prescription>(`${PRESCRIPTION_BASE_URL}/${id}`);
    return response.data;
  },

  // Get prescriptions by patient ID
  getPrescriptionsByPatientId: async (patientId: number): Promise<Prescription[]> => {
    const response = await apiClient.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/patient/${patientId}`);
    return response.data;
  },

  // Get prescriptions by doctor ID
  getPrescriptionsByDoctorId: async (doctorId: number): Promise<Prescription[]> => {
    const response = await apiClient.get<Prescription[]>(`${PRESCRIPTION_BASE_URL}/doctor/${doctorId}`);
    return response.data;
  },

  // Update prescription (Doctor only)
  updatePrescription: async (id: number, prescription: Partial<Prescription>): Promise<Prescription> => {
    const response = await apiClient.put<Prescription>(`${PRESCRIPTION_BASE_URL}/${id}`, prescription);
    return response.data;
  },

  // Delete prescription (Admin only)
  deletePrescription: async (id: number): Promise<void> => {
    await apiClient.delete(`${PRESCRIPTION_BASE_URL}/${id}`);
  },
};
