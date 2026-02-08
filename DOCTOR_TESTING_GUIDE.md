# Testing Doctor Features - Quick Guide

## Prerequisites

Before testing, ensure:

1. ✅ Backend is running on `http://localhost:8080`
2. ✅ Database has at least one doctor account
3. ✅ Database has at least one patient record
4. ✅ Frontend dependencies installed (`npm install`)
5. ✅ Frontend is running (`npm run dev`)

## Quick Test Checklist

### Step 1: Login as Doctor
```
URL: http://localhost:5173/login
Email: [your-doctor-email]
Password: [your-password]
```

**Expected Result:**
- ✅ Login form appears
- ✅ Enter credentials and click "Sign In"
- ✅ OTP verification page appears
- ✅ Enter OTP from backend logs/email
- ✅ Redirected to `/doctor/dashboard`

### Step 2: Verify Dashboard Stats

**What to Check:**
- ✅ Welcome message shows "Welcome back, Dr. [name]"
- ✅ "My Patients" card shows actual count (not "-")
- ✅ "Prescriptions" card shows actual count
- ✅ "Active Prescriptions" card shows count of active prescriptions
- ✅ All three quick action buttons are visible

**Screenshot Locations:** Dashboard should look professional with Bootstrap cards

### Step 3: Test View Patients

**Actions:**
1. Click "View Patients" button on dashboard
2. Wait for patient table to load

**Expected Result:**
- ✅ URL changes to `/doctor/patients`
- ✅ Page title shows "My Patients"
- ✅ Search box is visible at top
- ✅ Patient table displays with columns:
  - ID (badge with #)
  - Name (with username below)
  - Email
  - Date of Birth (formatted)
  - Age (calculated)
  - Contact
  - Actions (Prescribe button)
- ✅ Summary statistics cards at bottom show:
  - Total Patients
  - Patients with DOB
  - Patients with Contact Info

**Test Search:**
1. Type patient name in search box
2. Table filters immediately (no submit needed)
3. Clear search box to see all patients again

### Step 4: Test Quick Prescribe

**Actions:**
1. From "View Patients" page, click "Prescribe" button on any patient row
2. Observe navigation and form

**Expected Result:**
- ✅ URL changes to `/doctor/prescriptions/new?patientId=[id]`
- ✅ Patient dropdown is pre-selected with correct patient
- ✅ Patient dropdown is disabled (can't change)
- ✅ Form has three fields:
  - Patient (dropdown, pre-selected)
  - Medication Details (textarea)
  - Status (dropdown, defaults to "ACTIVE")
- ✅ HIPAA compliance notice appears at bottom
- ✅ "Create Prescription" button is enabled

### Step 5: Test Create Prescription

**Test Case 1: Validation Errors**
1. Leave medication field empty
2. Click "Create Prescription"
3. **Expected:** Error message "Medication details are required"

**Test Case 2: Successful Creation**
1. Select a patient (if not pre-selected)
2. Enter medication details:
   ```
   Medication: Amoxicillin 500mg
   Dosage: Take 1 tablet orally
   Frequency: Three times daily
   Duration: 7 days
   Instructions: Take with food
   ```
3. Select status: "ACTIVE"
4. Click "Create Prescription"

**Expected Result:**
- ✅ Button shows loading spinner "Creating Prescription..."
- ✅ Success message appears: "Prescription created successfully!"
- ✅ After 2 seconds, automatically redirects to `/doctor/prescriptions`
- ✅ New prescription appears in the list

### Step 6: Test View Prescriptions

**Actions:**
1. Navigate to `/doctor/prescriptions` (automatic after creation OR click "View Prescriptions" from dashboard)
2. Observe prescriptions list

**Expected Result:**
- ✅ Page title shows "My Prescriptions"
- ✅ Three summary cards at top show:
  - Total Prescriptions
  - Active (green)
  - Pending (yellow)
- ✅ Search box and status filter dropdown visible
- ✅ Prescription table displays with columns:
  - ID (badge)
  - Patient (name + email)
  - Medication (first 300 chars)
  - Issued At (formatted datetime)
  - Status (colored badge: green=Active, yellow=Pending, blue=Completed, gray=Cancelled)
  - Request ID (if exists)

**Test Status Filter:**
1. Select "ACTIVE" from status dropdown
2. Table shows only active prescriptions
3. Select "ALL" to show all again

**Test Search:**
1. Type patient name in search box
2. Table filters immediately
3. Type medication name
4. Table updates to match

### Step 7: Test Navigation Flow

**Back Button Navigation:**
1. From "View Patients" → Click "Back" → Returns to dashboard
2. From "View Prescriptions" → Click "Back" → Returns to dashboard
3. From "Create Prescription" → Click "Cancel" → Returns to previous page

**Dashboard Quick Actions:**
- ✅ "View Patients" → `/doctor/patients`
- ✅ "View Prescriptions" → `/doctor/prescriptions`
- ✅ "New Prescription" → `/doctor/prescriptions/new`

### Step 8: Test Loading States

**What to Check:**
1. When page first loads, spinner should appear with "Loading..." text
2. While creating prescription, button should show spinner and "Creating Prescription..."
3. Dashboard stat cards should show spinner until data loads

### Step 9: Test Error Handling

**Test Case: Backend Down**
1. Stop backend server
2. Try to load "View Patients" page
3. **Expected:** Red error alert appears with message
4. Restart backend
5. Refresh page
6. **Expected:** Data loads successfully

**Test Case: Invalid Doctor**
1. Login as user without doctor profile
2. Try to create prescription
3. **Expected:** Error message "Doctor information not found"

## Common Issues and Solutions

### Issue: "No patients found"
**Cause:** Database has no patient records  
**Solution:** Create patient through registration or admin panel

### Issue: "Failed to load patients"
**Cause:** Backend not running or CORS issue  
**Solution:** 
- Check backend is running: `http://localhost:8080/actuator/health`
- Verify CORS allows `http://localhost:5173`

### Issue: "Unauthorized (401)"
**Cause:** JWT expired  
**Solution:** Log out and log back in

### Issue: Count shows "0" but patients exist
**Cause:** Doctor has no associated patients  
**Solution:** This is normal if no prescriptions issued yet

### Issue: Dropdown shows no patients
**Cause:** No patients in database  
**Solution:** Register at least one patient first

### Issue: Icons not showing (□ boxes appear)
**Cause:** Bootstrap Icons CDN blocked or not loaded  
**Solution:** Check internet connection, verify CDN link in index.html

## API Testing (Optional)

Test backend endpoints directly:

### Get All Patients
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/patient
```

### Create Prescription
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient": {"id": 1},
    "doctor": {"id": 2},
    "medicationEncrypted": "Test medication",
    "status": "ACTIVE"
  }' \
  http://localhost:8080/api/prescriptions
```

### Get Doctor Prescriptions
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/prescriptions/doctor/2
```

## Success Criteria

All features working correctly if:

- ✅ Dashboard shows real counts (not placeholders)
- ✅ All three buttons navigate to correct pages
- ✅ Patient list loads and displays all patients
- ✅ Search and filter work without page refresh
- ✅ Prescription creation succeeds and shows in list
- ✅ Pre-selected patient works from "Prescribe" button
- ✅ Status badges show correct colors
- ✅ Loading states appear during API calls
- ✅ Error messages display when something fails
- ✅ Back/Cancel buttons navigate correctly
- ✅ No console errors in browser DevTools

## Performance Checks

1. **Initial Load:** Dashboard should load with all stats in < 2 seconds
2. **Patient List:** Should load all patients in < 1 second
3. **Prescription Creation:** Should submit and redirect in < 3 seconds
4. **Search:** Should filter instantly (< 100ms)
5. **Navigation:** Page transitions should be immediate

## Browser DevTools Check

Open browser console (F12) and verify:

- ✅ No red error messages
- ✅ API calls return 200 status codes
- ✅ JWT token is being sent in Authorization header
- ✅ React Query cache is working (check Network tab - requests cached)

## Final Verification

After completing all tests, verify:

1. ✅ Can view all patients
2. ✅ Can search/filter patients
3. ✅ Can create prescription from patient table
4. ✅ Can create prescription from dashboard
5. ✅ Can view all prescriptions
6. ✅ Can filter prescriptions by status
7. ✅ Dashboard counts are accurate
8. ✅ All navigation flows work
9. ✅ Loading and error states work
10. ✅ UI is responsive and professional

## Next Steps

Once basic testing passes:

1. **Mobile Testing:** Test on mobile device or browser responsive mode
2. **Role Testing:** Verify only DOCTOR role can access these pages
3. **Security Testing:** Verify JWT required for all endpoints
4. **Edge Cases:** Test with large datasets (100+ patients)
5. **Concurrent Users:** Test with multiple doctor accounts

## Test Data Setup (If Needed)

If you need to create test data manually:

### Create Test Doctor (SQL)
```sql
-- First create a user
INSERT INTO users (username, email, password, status, created_at)
VALUES ('drsmith', 'drsmith@hospital.com', 'hashed_password', 'ACTIVE', NOW());

-- Then create doctor profile
INSERT INTO doctors (user_id, name, specialization, license_number)
VALUES (1, 'Dr. John Smith', 'Cardiology', 'LIC123456');
```

### Create Test Patient (SQL)
```sql
-- First create a user
INSERT INTO users (username, email, password, status, created_at)
VALUES ('patient1', 'patient1@example.com', 'hashed_password', 'ACTIVE', NOW());

-- Then create patient profile
INSERT INTO patients (user_id, name, dob, contact_info)
VALUES (2, 'Jane Doe', '1990-05-15', '+1-555-0100');
```

## Report Issues

If any test fails, report with:
- Step number where it failed
- Expected vs actual result
- Browser console errors (if any)
- Network tab showing API response
- Screenshots of issue

---

**Happy Testing! 🏥**

For additional help, refer to:
- `DOCTOR_FEATURES.md` - Complete feature documentation
- `README.md` - Project setup guide
- `QUICKSTART.md` - Quick start guide
