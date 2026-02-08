// Types for Doctor, Patient, and Prescription entities

export interface Doctor {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  name: string;
  specialization: string | null;
  licenseNumber: string | null;
}

export interface Patient {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  name: string;
  dob: string | null; // ISO date string
  contactInfo: string | null;
}

export interface MedicalRecord {
  id: number;
  patient: Patient;
  doctor: Doctor;
  diagnosisEncrypted: string;
  treatmentEncrypted: string;
  notesEncrypted: string;
  recordDate: string; // ISO datetime string
  requestId: string;
}

export interface Prescription {
  id: number;
  patient: Patient;
  doctor: Doctor;
  medicalRecord: MedicalRecord | null;
  medicationEncrypted: string;
  issuedAt: string; // ISO datetime string
  status: string;
  requestId: string;
}

export interface CreatePrescriptionRequest {
  patient: {
    id: number;
  };
  doctor: {
    id: number;
  };
  medicalRecord?: {
    id: number;
  };
  medicationEncrypted: string;
  status: string;
}
