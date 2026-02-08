# TrustCare Hospital Management System - Frontend

A production-grade, security-focused healthcare frontend built with React 18, TypeScript, Vite, and Bootstrap 5.

## 🏥 Overview

This is the frontend application for the TrustCare Hospital Management System, designed to handle Protected Health Information (PHI) with the highest security standards.

## ✨ Key Features

- **Secure Authentication**: OTP-based login with JWT (stored in memory only)
- **Role-Based Access Control**: Admin, Doctor, and Patient dashboards
- **HIPAA Compliant**: PHI protection with strict security measures
- **Modern Tech Stack**: React 18, TypeScript, Vite, Bootstrap 5
- **Form Validation**: React Hook Form + Zod validators
- **State Management**: TanStack React Query + Context API

## 🔒 Security Features

- ✅ JWT tokens stored in memory only (NEVER localStorage/sessionStorage)
- ✅ Automatic logout on 401 Unauthorized
- ✅ HTTPS-ready with proper CORS configuration
- ✅ Password strength validation matching backend requirements
- ✅ No sensitive data logged or exposed in UI
- ✅ TypeScript strict mode enabled (no `any` types)

## 🛠️ Tech Stack

### Core
- **React** 18.2.0
- **TypeScript** 5.3.3 (strict mode)
- **Vite** 5.0.12

### UI Framework
- **Bootstrap** 5.3.2
- **React Bootstrap** 2.10.0
- **Bootstrap Icons** 1.11.3

### State & Data
- **TanStack React Query** 5.17.19
- **Axios** 1.6.5
- **React Router** 6.21.3

### Forms & Validation
- **React Hook Form** 7.49.3
- **Zod** 3.22.4
- **@hookform/resolvers** 3.3.4

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8080`

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd TrustCare_Frontend
npm install
```

### 2. Configure Environment

The `.env` file is already configured to connect to the backend:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
TrustCare_Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── DashboardLayout.tsx
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx
│   ├── guards/              # Route guards
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleGuard.tsx
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   ├── VerifyOtp.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── DoctorDashboard.tsx
│   │   └── PatientDashboard.tsx
│   ├── services/            # API services
│   │   └── auth.service.ts
│   ├── types/               # TypeScript types
│   │   └── auth.types.ts
│   ├── utils/               # Utility functions
│   │   └── apiClient.ts
│   ├── validators/          # Zod schemas
│   │   └── auth.validators.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Type definitions
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env
```

## 🔐 Authentication Flow

### 1. Login (Step 1)
- User enters email and password
- Backend validates credentials
- OTP sent to email (6-digit code, expires in 5 minutes)
- User redirected to OTP verification

### 2. OTP Verification (Step 2)
- User enters OTP code
- Backend validates OTP
- JWT token returned
- Token stored in memory only
- User redirected to role-based dashboard

### 3. Password Reset
- User requests password reset
- Backend sends 8-character token to email
- User enters token and new password
- Password validated against security requirements
- Account unlocked and user can login

## 🎨 UI/UX Features

- ✅ Professional healthcare-grade design
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Bootstrap grid system
- ✅ Loading states and spinners
- ✅ Inline form validation
- ✅ Real-time password strength indicator
- ✅ Friendly error messages
- ✅ Clean, accessible interface

## 🔌 API Integration

All API calls go through a centralized Axios instance (`apiClient.ts`) that:
- Automatically attaches JWT tokens
- Handles 401 responses (auto-logout)
- Provides consistent error handling
- Includes request/response interceptors

### Backend Endpoints Used

- `POST /auth/login` - Initiate login
- `POST /auth/verify-otp` - Verify OTP and get JWT
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/register` - Register new user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/me` - Get current user

## 🛡️ Security Best Practices Implemented

1. **Memory-Only Token Storage**: JWT never touches localStorage/sessionStorage
2. **Automatic Logout**: On 401 response, user logged out immediately
3. **Strict TypeScript**: No `any` types allowed
4. **Password Validation**: Matches backend requirements exactly
5. **No PHI Logging**: Sensitive data never logged or exposed
6. **CORS Ready**: Configured for proper CORS handling
7. **HTTPS Ready**: Works with SSL/TLS without modifications

## 🎯 Available Routes

### Public Routes
- `/login` - Login page
- `/verify-otp` - OTP verification
- `/register` - User registration
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token

### Protected Routes (Require Authentication)
- `/admin/dashboard` - Admin dashboard (ADMIN role only)
- `/doctor/dashboard` - Doctor dashboard (DOCTOR role only)
- `/patient/dashboard` - Patient dashboard (PATIENT role only)

## 🧪 Development

### Linting

```bash
npm run lint
```

### Type Checking

TypeScript strict mode is enabled with all strict flags:
- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `alwaysStrict`

## 📝 Form Validation

All forms use Zod schemas that match backend validation:

- **Email**: Valid email format
- **Password**: 
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 digit
  - At least 1 special character
- **Username**: 3-50 characters, alphanumeric + underscore
- **OTP**: Exactly 6 digits

## 🚨 Error Handling

- Form validation errors shown inline
- API errors displayed in alert boxes
- 401 Unauthorized: Auto logout + redirect
- 403 Forbidden: Access denied page
- Network errors: User-friendly messages

## 📦 Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains the production build

3. Serve with any static file server (nginx, Apache, etc.)

4. Ensure environment variables are set:
   ```env
   VITE_API_BASE_URL=https://your-api-domain.com
   ```

## 👥 User Roles

### Admin
- System management
- User management
- Audit logs
- Role and permission management

### Doctor
- View assigned patients
- Create/update medical records
- Manage prescriptions
- View patient history

### Patient
- View own medical records
- View prescriptions
- Book appointments
- View appointment history

## 🔄 State Management

- **Authentication**: Context API + React Query
- **Server State**: TanStack React Query
- **Token Storage**: In-memory JavaScript variable
- **Cache Invalidation**: On logout, all caches cleared

## 💻 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

Proprietary - TrustCare Hospital Management System

---

**Built with ❤️ for healthcare professionals**

*Secure • Compliant • Professional*
