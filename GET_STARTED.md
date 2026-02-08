# 🚀 GET STARTED NOW!

## Your TrustCare Frontend is Ready! 

### ✅ Everything is Installed and Configured

---

## 📋 Step-by-Step Guide to Launch

### **Step 1: Ensure Backend is Running**

Open a new terminal and start your backend:

```bash
cd TrustCare_Backend
mvn spring-boot:run
```

Wait for:
```
✅ Backend running on http://localhost:8080
```

---

### **Step 2: Start Frontend (THIS PROJECT)**

In this terminal, run:

```bash
cd TrustCare_Frontend
npm run dev
```

You should see:
```
  VITE v5.0.12  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

### **Step 3: Open Browser**

Navigate to:
```
http://localhost:3000
```

You'll be redirected to the login page automatically.

---

## 🔐 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                      │
└─────────────────────────────────────────────────────────────┘

START → http://localhost:3000
  ↓
┌─────────────────────┐
│   LOGIN PAGE        │
│  /login             │
│                     │
│  📧 Email           │
│  🔒 Password        │
│                     │
│  [Sign In Button]   │
└─────────────────────┘
  ↓ (Submit)
┌─────────────────────┐
│  BACKEND            │
│  Validates          │
│  Credentials        │
│  ✅ If Valid:       │
│  Sends OTP to email │
└─────────────────────┘
  ↓
┌─────────────────────┐
│  OTP VERIFICATION   │
│  /verify-otp        │
│                     │
│  Enter 6-digit OTP  │
│  (Check your email) │
│                     │
│  [Verify Button]    │
│  [Resend OTP]       │
└─────────────────────┘
  ↓ (OTP Valid)
┌─────────────────────┐
│  JWT TOKEN          │
│  Stored in Memory   │
│  (NOT localStorage) │
└─────────────────────┘
  ↓
┌─────────────────────┐
│  REDIRECT BY ROLE   │
│                     │
│  Admin → /admin/    │
│  Doctor → /doctor/  │
│  Patient → /patient/│
└─────────────────────┘
  ↓
┌─────────────────────┐
│   DASHBOARD         │
│   Role-based UI     │
│   Logged In!        │
└─────────────────────┘
```

---

## 📝 Test Registration Flow

```
┌─────────────────────┐
│  Click "Register"   │
│  on Login Page      │
└─────────────────────┘
  ↓
┌─────────────────────┐
│  REGISTRATION PAGE  │
│  /register          │
│                     │
│  Username           │
│  Email              │
│  Role (dropdown)    │
│  Password           │
│  Confirm Password   │
│                     │
│  [Create Account]   │
└─────────────────────┘
  ↓ (Validation)
┌─────────────────────┐
│  Password Rules:    │
│  ✅ 8+ characters   │
│  ✅ 1 uppercase     │
│  ✅ 1 lowercase     │
│  ✅ 1 digit         │
│  ✅ 1 special char  │
└─────────────────────┘
  ↓ (Valid)
┌─────────────────────┐
│  Account Created!   │
│  → Redirect to      │
│     Login Page      │
└─────────────────────┘
  ↓
┌─────────────────────┐
│  Login with         │
│  New Credentials    │
│  + OTP              │
└─────────────────────┘
```

---

## 🔑 Password Reset Flow

```
┌─────────────────────┐
│  Click "Forgot      │
│  Password?" on      │
│  Login Page         │
└─────────────────────┘
  ↓
┌─────────────────────┐
│  FORGOT PASSWORD    │
│  /forgot-password   │
│                     │
│  Enter Email        │
│  [Send Reset Token] │
└─────────────────────┘
  ↓
┌─────────────────────┐
│  Check Email        │
│  for 8-character    │
│  Reset Token        │
│  (e.g., ABC12345)   │
└─────────────────────┘
  ↓
┌─────────────────────┐
│  RESET PASSWORD     │
│  /reset-password    │
│                     │
│  Reset Token        │
│  New Password       │
│  Confirm Password   │
│  [Reset Password]   │
└─────────────────────┘
  ↓
┌─────────────────────┐
│  Password Changed!  │
│  → Login with new   │
│     credentials     │
└─────────────────────┘
```

---

## 🎯 Quick Test Checklist

### ✅ Must Test Before Demo:

#### 1. Registration (5 mins)
- [ ] Go to Register page
- [ ] Fill in all fields
- [ ] Try weak password (see error)
- [ ] Use strong password
- [ ] Submit
- [ ] See success message

#### 2. Login (3 mins)
- [ ] Enter registered email/password
- [ ] Submit
- [ ] Check email for OTP
- [ ] Enter OTP
- [ ] Redirected to dashboard

#### 3. OTP Resend (2 mins)
- [ ] During OTP verification
- [ ] Click "Resend OTP"
- [ ] Check email for new OTP
- [ ] Enter new OTP

#### 4. Password Reset (5 mins)
- [ ] Click "Forgot Password?"
- [ ] Enter email
- [ ] Check email for token
- [ ] Go to Reset Password
- [ ] Enter token + new password
- [ ] Login with new password + OTP

#### 5. Account Lockout (3 mins)
- [ ] Login with wrong password 5 times
- [ ] See lockout message
- [ ] Wait 30 minutes OR reset password

#### 6. Role-Based Access (3 mins)
- [ ] Login as Patient
- [ ] Try to access /admin/dashboard
- [ ] See Access Denied

#### 7. Logout (1 min)
- [ ] Click user dropdown
- [ ] Click Logout
- [ ] Redirected to Login
- [ ] Token cleared

**Total Test Time: ~22 minutes**

---

## 📱 Test on Different Devices

### Desktop (Primary)
```
✅ Chrome
✅ Firefox
✅ Edge
```

### Mobile (Responsive)
```
📱 Open DevTools (F12)
📱 Toggle Device Toolbar
📱 Select iPhone/Android
📱 Test all pages
```

### Tablet
```
📱 Toggle Device Toolbar
📱 Select iPad
📱 Test all pages
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to backend"
**Solution:**
```bash
# Check backend is running
curl http://localhost:8080/actuator/health

# If not working, start backend
cd TrustCare_Backend
mvn spring-boot:run
```

### Issue 2: "OTP not received"
**Solution:**
1. Check backend email configuration
2. Check spam/junk folder
3. Wait 1-2 minutes
4. Click "Resend OTP"

### Issue 3: "Port 3000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.ts
```

### Issue 4: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: "TypeScript errors"
**Solution:**
```bash
npm run build
# Check output for specific errors
```

---

## 🎨 UI Preview

### Login Page
```
┌──────────────────────────────────────┐
│         🏥 TrustCare                 │
│    Hospital Management System        │
├──────────────────────────────────────┤
│                                      │
│         Sign In                      │
│                                      │
│  Email Address                       │
│  ┌────────────────────────────────┐ │
│  │ Enter your email               │ │
│  └────────────────────────────────┘ │
│                                      │
│  Password                            │
│  ┌────────────────────────────────┐ │
│  │ Enter your password            │ │
│  └────────────────────────────────┘ │
│                                      │
│              Forgot Password?        │
│                                      │
│  ┌────────────────────────────────┐ │
│  │        Sign In                 │ │
│  └────────────────────────────────┘ │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│   Don't have an account?             │
│   Register Now                       │
│                                      │
└──────────────────────────────────────┘
```

### Dashboard (Any Role)
```
┌──────────────────────────────────────────────┐
│ 🏥 TrustCare  | Dashboard | 🔔 | 👤 Username │
├──────────────────────────────────────────────┤
│                                              │
│  Welcome back, Username!                     │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 👥 Card  │ │ 📋 Card  │ │ 📊 Card  │    │
│  │          │ │          │ │          │    │
│  │  Stats   │ │  Stats   │ │  Stats   │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                              │
│  Quick Actions                               │
│  ┌────────────────────────────────────────┐ │
│  │ [Button] [Button] [Button]             │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Profile Information                         │
│  ┌────────────────────────────────────────┐ │
│  │ Email: user@example.com                │ │
│  │ Role: PATIENT                          │ │
│  │ Status: Active                         │ │
│  └────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 📂 Project File Tree

```
TrustCare_Frontend/
├── 📄 package.json          ← Dependencies
├── 📄 tsconfig.json         ← TypeScript config
├── 📄 vite.config.ts        ← Vite config
├── 📄 .env                  ← Environment vars
├── 📄 index.html            ← HTML entry
├── 📄 README.md             ← Full docs
├── 📄 QUICKSTART.md         ← Quick guide
├── 📄 INSTALLATION.md       ← Install guide
├── 📄 PROJECT_SUMMARY.md    ← Summary
├── 📄 GET_STARTED.md        ← This file!
│
└── 📁 src/
    ├── 📄 main.tsx          ← Entry point
    ├── 📄 App.tsx           ← Main app
    │
    ├── 📁 components/       ← UI components
    │   └── DashboardLayout.tsx
    │
    ├── 📁 context/          ← State management
    │   └── AuthContext.tsx
    │
    ├── 📁 guards/           ← Route protection
    │   ├── ProtectedRoute.tsx
    │   └── RoleGuard.tsx
    │
    ├── 📁 pages/            ← All pages
    │   ├── Login.tsx
    │   ├── VerifyOtp.tsx
    │   ├── Register.tsx
    │   ├── ForgotPassword.tsx
    │   ├── ResetPassword.tsx
    │   ├── AdminDashboard.tsx
    │   ├── DoctorDashboard.tsx
    │   └── PatientDashboard.tsx
    │
    ├── 📁 services/         ← API calls
    │   └── auth.service.ts
    │
    ├── 📁 types/            ← TypeScript types
    │   └── auth.types.ts
    │
    ├── 📁 utils/            ← Utilities
    │   └── apiClient.ts
    │
    └── 📁 validators/       ← Form validation
        └── auth.validators.ts
```

---

## 🎯 What You Need to Know

### 1. **Security**
- JWT stored in **memory only**
- Automatic logout on 401
- No sensitive data in console
- Password strength enforced

### 2. **Authentication**
- 2-step login (password + OTP)
- OTP expires in 5 minutes
- Account locks after 5 failed attempts
- Password reset via email token

### 3. **Routing**
- Public routes: `/login`, `/register`, etc.
- Protected routes: `/admin/*`, `/doctor/*`, `/patient/*`
- Role-based access control
- Auto-redirect on unauthorized

### 4. **State Management**
- Auth state in Context API
- Server state in React Query
- Token in memory variable
- Cache invalidation on logout

### 5. **Error Handling**
- Form validation errors (inline)
- API errors (alert boxes)
- 401 → auto logout
- 403 → access denied page
- Network errors → friendly messages

---

## 🚀 Ready to Launch!

### Command to Start:
```bash
npm run dev
```

### URL to Open:
```
http://localhost:3000
```

### First Action:
1. Click **"Register Now"**
2. Create a test account
3. Check email for confirmation
4. Login with OTP
5. Explore dashboard!

---

## 🎉 You're All Set!

Everything is configured and ready to go.

**Just run:**
```bash
npm run dev
```

**And open:**
```
http://localhost:3000
```

---

## 📞 Need Help?

### Read Documentation:
- [README.md](README.md) - Complete documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [INSTALLATION.md](INSTALLATION.md) - Detailed setup
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview

### Check Troubleshooting:
- See [INSTALLATION.md](INSTALLATION.md) → Troubleshooting section

---

**Happy Coding! 🎉**

**Built with ❤️ for Healthcare Professionals**

*Secure • Compliant • Professional*
