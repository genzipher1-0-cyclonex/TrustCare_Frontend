# TrustCare Frontend - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd TrustCare_Frontend
npm install
```

### Step 2: Verify Environment Configuration
The `.env` file should contain:
```
VITE_API_BASE_URL=http://localhost:8080
```

### Step 3: Start Development Server
```bash
npm run dev
```

Open your browser and navigate to: `http://localhost:3000`

---

## 🔑 Test the Application

### Login Flow:
1. Go to `http://localhost:3000` (redirects to login)
2. Enter credentials:
   - Email: your registered email
   - Password: your password
3. Check email for 6-digit OTP code
4. Enter OTP to complete login
5. Redirected to role-based dashboard

### Registration Flow:
1. Click "Register Now" on login page
2. Fill in:
   - Username (alphanumeric + underscore)
   - Email
   - Role (Admin/Doctor/Patient)
   - Password (must meet requirements)
   - Confirm Password
3. Submit and check email for confirmation
4. Login with new credentials + OTP

### Password Reset Flow:
1. Click "Forgot Password?" on login page
2. Enter your email
3. Check email for 8-character reset token
4. Click "Enter Reset Token" or go to Reset Password page
5. Enter token and new password
6. Login with new password + OTP

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🎨 Features Implemented

### ✅ Authentication
- [x] Login with email/password
- [x] OTP verification (6-digit code)
- [x] Resend OTP
- [x] User registration with role selection
- [x] Forgot password
- [x] Reset password with token
- [x] Account lockout after 5 failed attempts
- [x] Automatic logout on 401

### ✅ Security
- [x] JWT stored in memory only
- [x] Automatic token attachment to requests
- [x] Password strength validation
- [x] TypeScript strict mode
- [x] No sensitive data logging
- [x] HIPAA-compliant design

### ✅ UI/UX
- [x] Responsive design (mobile/tablet/desktop)
- [x] Bootstrap 5 components
- [x] Loading states
- [x] Error handling
- [x] Form validation with inline errors
- [x] Password strength indicator
- [x] Professional healthcare design

### ✅ Dashboards
- [x] Admin Dashboard
- [x] Doctor Dashboard
- [x] Patient Dashboard
- [x] Role-based routing
- [x] Protected routes

---

## 🔍 Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (see error)
- [ ] OTP verification
- [ ] Resend OTP
- [ ] Register new user
- [ ] Password validation (try weak password)
- [ ] Forgot password
- [ ] Reset password
- [ ] Logout
- [ ] Try accessing protected route without login
- [ ] Try accessing Admin route as Patient (access denied)
- [ ] Responsive design on mobile
- [ ] Form validation errors

---

## 🛠️ Backend Connection

Make sure the backend is running on `http://localhost:8080`

If using a different URL, update `.env`:
```
VITE_API_BASE_URL=http://your-backend-url
```

---

## 📞 Need Help?

Check the main [README.md](README.md) for detailed documentation.

---

**Happy Coding! 🎉**
