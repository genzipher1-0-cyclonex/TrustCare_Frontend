import apiClient from '../utils/apiClient';
import {
  AuthRequest,
  AuthResponse,
  LoginInitiateResponse,
  OtpVerificationRequest,
  RegisterRequest,
  PasswordResetRequest,
  PasswordResetVerification,
  User,
} from '../types/auth.types';

const AUTH_BASE_URL = '/auth';

export const authService = {
  // Step 1: Initiate login - Send credentials, receive OTP
  initiateLogin: async (data: AuthRequest): Promise<LoginInitiateResponse> => {
    const response = await apiClient.post<LoginInitiateResponse>(
      `${AUTH_BASE_URL}/login`,
      data
    );
    return response.data;
  },

  // Step 2: Verify OTP and get JWT token
  verifyOtp: async (data: OtpVerificationRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      `${AUTH_BASE_URL}/verify-otp`,
      data
    );
    return response.data;
  },

  // Resend OTP
  resendOtp: async (username: string): Promise<LoginInitiateResponse> => {
    const response = await apiClient.post<LoginInitiateResponse>(
      `${AUTH_BASE_URL}/resend-otp`,
      username,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
    return response.data;
  },

  // Register new user
  register: async (data: RegisterRequest): Promise<string> => {
    const response = await apiClient.post<string>(
      `${AUTH_BASE_URL}/register`,
      data
    );
    return response.data;
  },

  // Request password reset
  forgotPassword: async (data: PasswordResetRequest): Promise<string> => {
    const response = await apiClient.post<string>(
      `${AUTH_BASE_URL}/forgot-password`,
      data
    );
    return response.data;
  },

  // Reset password with token
  resetPassword: async (data: PasswordResetVerification): Promise<string> => {
    const response = await apiClient.post<string>(
      `${AUTH_BASE_URL}/reset-password`,
      data
    );
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>(`${AUTH_BASE_URL}/me`);
    return response.data;
  },
};
