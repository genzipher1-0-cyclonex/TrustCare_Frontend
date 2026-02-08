// Types matching backend DTOs and entities

export interface User {
  id?: number; // Backend returns 'id'
  userId?: number; // Alternative name (for compatibility)
  username: string;
  email: string;
  status: string;
  role: Role;
  failedLoginAttempts: number | null;
  accountLocked: boolean | null;
  lockTime: string | null;
}

export interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

export interface Permission {
  permissionId: number;
  permissionName: string;
  description: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roleName: string;
}

export interface OtpVerificationRequest {
  username: string;
  otp: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetVerification {
  token: string;
  newPassword: string;
}

export interface LoginInitiateResponse {
  message: string;
  username: string;
  otpSent: boolean;
  maskedEmail: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface ApiError {
  message: string;
  errors?: string[];
}

export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';
