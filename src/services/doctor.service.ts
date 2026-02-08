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

  // Get doctor by user ID
  getDoctorByUserId: async (userId: number): Promise<Doctor> => {
    const response = await apiClient.get<Doctor>(`${DOCTOR_BASE_URL}/user/${userId}`);
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
