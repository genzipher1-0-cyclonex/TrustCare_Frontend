# Fix: Doctor Information Not Found

## Problem
The error "Doctor information not found" occurs because:
- ✅ User account exists with DOCTOR role
- ❌ No corresponding Doctor record in the `doctor` table
- The backend endpoint `/doctor/user/{userId}` returns `null`

## Root Cause
When you register a new user or create a user account with DOCTOR role, only the User record is created. The corresponding Doctor entity (with specialization, license number, etc.) must be created separately.

## Solution

### Step 1: Run the SQL Script

**Option A: Using psql Command Line**
```bash
# Navigate to backend directory
cd H:\GenZipherWeb\TrustCare_Backend

# Connect to your database and run the script
psql -U your_username -d trustcare_db -f seed_sample_data.sql
```

**Option B: Using pgAdmin or Database Client**
1. Open pgAdmin or your PostgreSQL client
2. Connect to your `trustcare_db` database
3. Open [seed_sample_data.sql](seed_sample_data.sql)
4. Execute the entire script
5. Check the results at the bottom (verification queries)

**Option C: Using Docker (if using docker-compose)**
```bash
# Navigate to backend directory
cd H:\GenZipherWeb\TrustCare_Backend

# Copy script into container and execute
docker-compose exec db psql -U postgres -d trustcare_db -f /seed_sample_data.sql

# Or connect interactively
docker-compose exec db psql -U postgres -d trustcare_db
# Then paste the SQL contents
```

### Step 2: Verify Data Created

After running the script, you should see output showing:

**Users Created:**
- `doctoruser` (DOCTOR) - doctor@trustcare.com
- `dr.sarah` (DOCTOR) - sarah@trustcare.com  
- `patient1` (PATIENT) - patient1@email.com
- `patient2` (PATIENT) - patient2@email.com
- `adminuser` (ADMIN) - admin@trustcare.com

**Doctor Records:**
- Dr. John Smith (General Medicine) - linked to doctoruser
- Dr. Sarah Johnson (Cardiology) - linked to dr.sarah

**Patient Records:**
- John Doe (patient1)
- Jane Smith (patient2)

### Step 3: Test the Fix

1. **Logout** from the current session
2. **Clear browser cache** (or use incognito mode)
3. **Login** using:
   - Username: `doctoruser`
   - Password: `password123`
4. Navigate to **Create Prescription**
5. You should now see:
   - ✅ No error message about doctor information
   - ✅ Patient search dropdown working
   - ✅ "Create Prescription" button enabled

### Step 4: Test Prescription Creation

1. Search for a patient (type "John" or "Jane")
2. Select patient from dropdown
3. Enter medication details:
   ```
   Medication: Amoxicillin 500mg
   Take 3 times daily for 7 days
   ```
4. Select Status: **ACTIVE**
5. Click **Create Prescription**
6. Should redirect to View Prescriptions page
7. Your new prescription should appear in the list

---

## Alternative: Create Doctor Record for Existing User

If you already have a specific user you want to make a doctor:

```sql
-- Find your user ID first
SELECT id, username, email FROM "user" WHERE username = 'your_username';

-- Then create doctor record (replace USER_ID with actual ID)
INSERT INTO doctor (user_id, name, specialization, license_number)
VALUES (
    USER_ID,  -- Replace with actual user ID
    'Dr. Your Name',
    'Your Specialization',
    'LICENSE-NUMBER'
);
```

---

## Understanding User-Entity Relationship

In TrustCare, there's a separation between:

1. **User Account** (`user` table)
   - Authentication credentials (username, password)
   - Role assignment (ADMIN, DOCTOR, PATIENT)
   - Account status and security settings

2. **Entity Records** (separate tables)
   - `doctor` table - medical professionals
   - `patient` table - patients
   - `admin` table - administrators

**One-to-One Relationship:**
```
user.id (role=DOCTOR) ←→ doctor.user_id
user.id (role=PATIENT) ←→ patient.user_id
user.id (role=ADMIN) ←→ admin.user_id
```

This design allows:
- Users to have authentication separate from their entity data
- Entity-specific fields (like `specialization` for doctors, `dob` for patients)
- Role-based access control

---

## Future Enhancement Recommendation

Consider automatically creating entity records during registration:

**In your registration endpoint:**
```java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    // Create user
    User user = userService.createUser(request);
    
    // Auto-create entity based on role
    if (user.getRole().getRoleName().equals("DOCTOR")) {
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setName(request.getName());
        doctorService.saveDoctor(doctor);
    } else if (user.getRole().getRoleName().equals("PATIENT")) {
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setName(request.getName());
        patientService.savePatient(patient);
    }
    
    return ResponseEntity.ok("Registration successful");
}
```

This ensures every DOCTOR user automatically gets a Doctor record.

---

## Summary

✅ **Issue**: User has DOCTOR role but no Doctor entity record  
✅ **Fix**: Run [seed_sample_data.sql](seed_sample_data.sql) to create sample data  
✅ **Test**: Login as `doctoruser` / `password123` and create prescription  
✅ **Next**: Consider auto-creating entity records during registration

**Status**: Ready to test! 🚀
