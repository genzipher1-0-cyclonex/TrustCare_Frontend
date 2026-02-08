import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { setAuthToken, clearAuthToken, getAuthToken } from '../utils/apiClient';
import {
  AuthRequest,
  AuthResponse,
  OtpVerificationRequest,
  RegisterRequest,
  User,
  UserRole,
  LoginInitiateResponse,
  PasswordResetRequest,
  PasswordResetVerification,
} from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  
  // Authentication actions
  login: (data: AuthRequest) => Promise<LoginInitiateResponse>;
  verifyOtp: (data: OtpVerificationRequest) => Promise<void>;
  resendOtp: (username: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  
  // Password reset actions
  forgotPassword: (data: PasswordResetRequest) => Promise<void>;
  resetPassword: (data: PasswordResetVerification) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch current user on mount if token exists
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!getAuthToken(),
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, [currentUser]);

  // Login mutation (step 1: initiate login)
  const loginMutation = useMutation({
    mutationFn: authService.initiateLogin,
  });

  // Verify OTP mutation (step 2: complete login)
  const verifyOtpMutation = useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: async (data: AuthResponse) => {
      // Store token in memory only
      setAuthToken(data.token);
      
      // Fetch user data
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      
      // Navigate to dashboard based on role
      const role = data.role.toUpperCase();
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (role === 'PATIENT') {
        navigate('/patient/dashboard');
      } else {
        navigate('/dashboard');
      }
    },
  });

  // Resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: authService.resendOtp,
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate('/login');
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      navigate('/login');
    },
  });

  const login = async (data: AuthRequest): Promise<LoginInitiateResponse> => {
    return loginMutation.mutateAsync(data);
  };

  const verifyOtp = async (data: OtpVerificationRequest): Promise<void> => {
    await verifyOtpMutation.mutateAsync(data);
  };

  const resendOtp = async (username: string): Promise<void> => {
    await resendOtpMutation.mutateAsync(username);
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    await registerMutation.mutateAsync(data);
  };

  const forgotPassword = async (data: PasswordResetRequest): Promise<void> => {
    await forgotPasswordMutation.mutateAsync(data);
  };

  const resetPassword = async (data: PasswordResetVerification): Promise<void> => {
    await resetPasswordMutation.mutateAsync(data);
  };

  const logout = (): void => {
    // Clear token from memory
    clearAuthToken();
    
    // Clear user state
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear all React Query cache
    queryClient.clear();
    
    // Navigate to login with replace to prevent back button navigation
    navigate('/login', { replace: true });
  };

  const role: UserRole | null = user?.role?.roleName as UserRole || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        role,
        login,
        verifyOtp,
        resendOtp,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
