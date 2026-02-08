import apiClient from '../utils/apiClient';
import { Doctor } from '../types/entities.types';

const DOCTOR_BASE_URL = '/doctor';

export const doctorService = {
  // Get all doctors
  getAllDoctors: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>(`${DOCTOR_BASE_URL}`);
    return response.data;
  },

  // Get doctor by ID
  getDoctorById: async (id: number): Promise<Doctor> => {
    const response = await apiClient.get<Doctor>(`${DOCTOR_BASE_URL}/${id}`);
    return response.data;
  },

  // Get or create doctor record for current logged-in user
  // This auto-creates the doctor record if it doesn't exist
  getMyDoctorRecord: async (): Promise<Doctor> => {
    console.log('Calling API: GET /doctor/me');
    const response = await apiClient.get<Doctor>(`${DOCTOR_BASE_URL}/me`);
    console.log('API Response:', response.status, response.data);
    
    if (!response.data) {
      throw new Error('Failed to get or create doctor record');
    }
    
    return response.data;
  },

  // Get doctor by user ID (legacy - use getMyDoctorRecord instead)
  getDoctorByUserId: async (userId: number): Promise<Doctor> => {
    console.log(`Calling API: GET ${DOCTOR_BASE_URL}/user/${userId}`);
    const response = await apiClient.get<Doctor>(`${DOCTOR_BASE_URL}/user/${userId}`);
    console.log('API Response:', response.status, response.data);
    
    // If backend returns null, throw error
    if (!response.data) {
      throw new Error(`No doctor record found for user ID: ${userId}. Please use /doctor/me to auto-create.`);
    }
    
    return response.data;
  },

  // Get doctor by license number
  getDoctorByLicenseNumber: async (licenseNumber: string): Promise<Doctor> => {
    const response = await apiClient.get<Doctor>(`${DOCTOR_BASE_URL}/license/${licenseNumber}`);
    return response.data;
  },

  // Get doctors by specialization
  getDoctorsBySpecialization: async (specialization: string): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>(`${DOCTOR_BASE_URL}/specialization/${specialization}`);
    return response.data;
  },

  // Create doctor
  createDoctor: async (doctor: Partial<Doctor>): Promise<Doctor> => {
    const response = await apiClient.post<Doctor>(`${DOCTOR_BASE_URL}`, doctor);
    return response.data;
  },

  // Update doctor
  updateDoctor: async (id: number, doctor: Partial<Doctor>): Promise<Doctor> => {
    const response = await apiClient.put<Doctor>(`${DOCTOR_BASE_URL}/${id}`, doctor);
    return response.data;
  },

  // Delete doctor
  deleteDoctor: async (id: number): Promise<void> => {
    await apiClient.delete(`${DOCTOR_BASE_URL}/${id}`);
  },
};
