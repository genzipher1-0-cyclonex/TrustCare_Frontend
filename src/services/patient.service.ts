import apiClient from '../utils/apiClient';
import { Patient } from '../types/entities.types';

const PATIENT_BASE_URL = '/patient';

export const patientService = {
  // Get all patients (Admin and Doctor only)
  getAllPatients: async (): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>(`${PATIENT_BASE_URL}`);
    return response.data;
  },

  // Get patient by ID
  getPatientById: async (id: number): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`${PATIENT_BASE_URL}/${id}`);
    return response.data;
  },

  // Get patient by user ID
  getPatientByUserId: async (userId: number): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`${PATIENT_BASE_URL}/user/${userId}`);
    return response.data;
  },

  // Create patient
  createPatient: async (patient: Partial<Patient>): Promise<Patient> => {
    const response = await apiClient.post<Patient>(`${PATIENT_BASE_URL}`, patient);
    return response.data;
  },

  // Update patient
  updatePatient: async (id: number, patient: Partial<Patient>): Promise<Patient> => {
    const response = await apiClient.put<Patient>(`${PATIENT_BASE_URL}/${id}`, patient);
    return response.data;
  },

  // Delete patient
  deletePatient: async (id: number): Promise<void> => {
    await apiClient.delete(`${PATIENT_BASE_URL}/${id}`);
  },
};
