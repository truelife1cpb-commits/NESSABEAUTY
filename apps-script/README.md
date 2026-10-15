# NESSABEAUTY (NSB) MANAGEMENT SYSTEM
### Google Sheets + Google Apps Script + HTML Web App Architecture
**Brand:** NESSABEAUTY (NSB)  
**Slogan:** *"Alluring wig for the classy lady."*  
**Specialization:** Wig Installation & Frontal Customization, Hairstyling, Makeup Artistry

---

## 1. OVERVIEW & CAPABILITIES
This repository contains the complete Google Apps Script production files and interactive web management platform for **NESSABEAUTY (NSB)**. The system is engineered to run directly inside a Google Spreadsheet using Google Apps Script HTML Service and Drive/Gmail APIs.

### Core Modules:
1. **24-Sheet Relational Schema:** Settings, Users, Candidates, Registrations, Courses, CourseModules, Trainers, CourseTrainers, Payments, PaymentAllocations, Receipts, Expenses, Attendance, Assessments, Grades, CandidateProgress, Certificates, Inventory, InventoryTransactions, Notifications, Documents, AuditLogs, AcademicTerms, Refunds.
2. **Admissions & Online Registration:** Shareable public link and native Google Form response synchronization.
3. **Financials & Installment Management:** Default $50 registration fee + $100 tuition fee = $150 total (Jan 15, 2027 – Feb 11, 2027 cohort), partial payments, scholarship discount authorizations, payment reversals, and balance recalculation.
4. **Receipt Generation:** Idempotent receipt issuance with official NSB branding, watermarks, remaining balance calculation, and verification codes.
5. **Roll Call Attendance:** Session date/topic logging, batch status (Present, Absent, Late, Excused), duplicate prevention, and 80% certification threshold alert.
6. **Academic Gradebook:** Theory & practical assessments, curriculum weighting, trainer feedback, and published/draft states.
7. **Certificate Center:** Automated 3-point eligibility check (attendance >= 80%, passing score >= 70%, zero outstanding tuition balance) before issuance.
8. **Inventory & Salon Stock:** Consumables and tools tracking (HD Swiss lace frontals, mannequin heads, adhesives, tint mousses), min-stock warnings, and usage logging.
9. **Accounting & Expenses:** Expense categories, supplier invoices, net cash flow calculation, and CSV statement exports.
10. **Communications:** WhatsApp Click-to-Chat pre-filled generator (no API required) and automated Gmail confirmations.

---

## 2. STEP-BY-STEP DEPLOYMENT GUIDE

### Step 1: Open Your Google Spreadsheet
1. Open your existing Google Spreadsheet (or create a new empty one at `sheets.new`).
2. Rename the spreadsheet to: `NESSABEAUTY (NSB) Master Database`.

### Step 2: Open the Apps Script Editor
1. In your Google Spreadsheet, click **Extensions** > **Apps Script**.
2. Rename the Apps Script project to `NSB-Management-System`.

### Step 3: Copy the Source Code Files
Create and paste the exact contents of each file from this directory:
1. **`Code.gs`** — Application entry point, LockService, 24-sheet initialization, auth, and backend logic.
2. **`Index.html`** — Main responsive application container shell.
3. **`Styles.html`** — Reusable CSS design system with NSB luxury theme.
4. **`JavaScript.html`** — Frontend controller invoking `google.script.run`.
5. **`Registration.html`** — Standalone candidate registration form.
6. **`Login.html`** — Secure authentication page.
7. **`Admin.html`** — Administration console.
8. **`Student.html`** — Candidate student portal.

### Step 4: Run the Initialization Function
1. In the Apps Script editor toolbar, select the function **`initializeDatabase`** from the function dropdown.
2. Click **Run**.
3. Authorize Google permissions (SpreadsheetApp, DriveApp, MailApp) when prompted.
4. Verify your spreadsheet: All 24 sheets will be created automatically with headers, deep wine/gold styling, and default Jan 2027 beauty courses!

### Step 5: Create the First Super Administrator
1. In the editor toolbar, select **`createFirstAdmin`** or run this snippet in the script editor:
   ```javascript
   function setupOwner() {
     createFirstAdmin('admin@nessabeauty.com', 'NessaBeauty2027!', 'Vanessa Nneka (Founder)');
   }
   ```
2. Click **Run**. Your super admin credentials will be hashed using SHA-256 and stored securely in the `Users` sheet.

### Step 6: Deploy as a Web App
1. In the top right corner of Apps Script, click **Deploy** > **New deployment**.
2. Select type: **Web app**.
3. Description: `NSB Management System v1.0`.
4. Execute as: **Me (your Google account)**.
5. Who has access: **Anyone** (allows public candidate registration and verification without requiring candidates to have Google accounts).
6. Click **Deploy** and copy the resulting Web App URL:
   `https://script.google.com/macros/s/.../exec`

---

## 3. KEY URL WORKFLOWS
- **Administration & Staff Portal:** `https://script.google.com/macros/s/.../exec?page=admin`
- **Public Candidate Registration:** `https://script.google.com/macros/s/.../exec?page=register`
- **Candidate Student Portal:** `https://script.google.com/macros/s/.../exec?page=student`
- **Public Credential Verification:** `https://script.google.com/macros/s/.../exec?page=verify`

---

## 4. GOOGLE FORM INTEGRATION WORKFLOW
If you prefer collecting candidate applications using a native Google Form:
1. Create a Google Form with fields: Full Name, Email, Phone, Course, Emergency Name, Emergency Phone.
2. In Google Form **Responses** tab > click **Link to Sheets** > select your NSB Master Spreadsheet.
3. In your Apps Script editor, open **Triggers** (alarm clock icon on left sidebar).
4. Click **Add Trigger**:
   - Choose which function to run: `processFormRegistration`
   - Select event source: **From spreadsheet**
   - Select event type: **On form submit**
5. Save the trigger. Whenever a candidate submits the Google Form, the response is automatically normalized, assigned a unique ID (`NSB-CND-2027-XXX`), assigned the default $150 fee, and sent a confirmation email!

---

## 5. 28-POINT ACCEPTANCE TEST CHECKLIST
- [x] **Test 1:** Initialize empty spreadsheet without errors (`initializeDatabase()` creates 24 sheets).
- [x] **Test 2:** Create first administrator securely (`createFirstAdmin`).
- [x] **Test 3:** Log in with appropriate permissions (SHA-256 cryptographic check).
- [x] **Test 4:** Submit candidate registration online.
- [x] **Test 5:** Store candidate details with assigned ID and timestamps.
- [x] **Test 6:** Prevent cross-candidate unauthorized record viewing.
- [x] **Test 7:** Approve candidate and enroll them in course.
- [x] **Test 8:** Apply authorized scholarship discount with audit reasoning.
- [x] **Test 9:** Track installment payment schedules.
- [x] **Test 10:** Record and confirm partial payments.
- [x] **Test 11:** Generate unique PDF receipt with verification code.
- [x] **Test 12:** Calculate accurate outstanding balance after payments.
- [x] **Test 13:** Reverse or refund payment while preserving audit history.
- [x] **Test 14:** Record session attendance and prevent duplicate entries for same session.
- [x] **Test 15:** Enter theory and practical grades.
- [x] **Test 16:** Compute weighted gradebook calculations.
- [x] **Test 17:** Individual candidate progress tracking.
- [x] **Test 18:** Issue graduation certificate ONLY after 3-point eligibility check.
- [x] **Test 19:** Record operational expenses and generate net cash movement statement.
- [x] **Test 20:** Record salon inventory usage during training.
- [x] **Test 21:** Send automated email notifications via MailApp.
- [x] **Test 22:** Open pre-filled WhatsApp click-to-chat links with sanitized numbers.
- [x] **Test 23:** Real-time KPI dashboard figures traceable to underlying records.
- [x] **Test 24:** Export CSV statements.
- [x] **Test 25:** Repeated initialization does not erase existing rows.
- [x] **Test 26:** LockService prevents concurrent corruption during payments.
- [x] **Test 27:** Student accounts cannot access administrative tabs.
- [x] **Test 28:** Public users cannot access raw Google Drive files or private user data.

---

## 6. TROUBLESHOOTING & COMMON RESOLUTIONS
1. **"Authorization is required" / Google Security Screen:**
   Click *Advanced* > *Go to NSB-Management-System (unsafe)* > Click *Allow*. This is standard when deploying personal Google Apps Scripts.
2. **Quota Exceeded for Email:**
   Free Gmail accounts have a daily quota of 100 emails/day; Google Workspace accounts have 1,500/day. The system catches quota errors gracefully and preserves candidate records even if email dispatch fails.
3. **LockService Timeout:**
   The script uses a 30-second lock window. If multiple concurrent payments occur simultaneously, they queue cleanly in chronological order.
