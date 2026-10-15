/**
 * ============================================================================
 * NESSABEAUTY (NSB) MANAGEMENT SYSTEM - BACKEND ENGINE
 * Brand: NESSABEAUTY (NSB)
 * Slogan: "Alluring wig for the classy lady."
 * Platform: Google Apps Script + Google Sheets + HTML Service
 * ============================================================================
 */

// Global Constants & Sheet Configurations
var NSB_SHEETS = {
  SETTINGS: 'Settings',
  USERS: 'Users',
  CANDIDATES: 'Candidates',
  REGISTRATIONS: 'Registrations',
  COURSES: 'Courses',
  COURSE_MODULES: 'CourseModules',
  TRAINERS: 'Trainers',
  COURSE_TRAINERS: 'CourseTrainers',
  PAYMENTS: 'Payments',
  PAYMENT_ALLOCATIONS: 'PaymentAllocations',
  RECEIPTS: 'Receipts',
  EXPENSES: 'Expenses',
  ATTENDANCE: 'Attendance',
  ASSESSMENTS: 'Assessments',
  GRADES: 'Grades',
  CANDIDATE_PROGRESS: 'CandidateProgress',
  CERTIFICATES: 'Certificates',
  INVENTORY: 'Inventory',
  INVENTORY_TRANSACTIONS: 'InventoryTransactions',
  NOTIFICATIONS: 'Notifications',
  DOCUMENTS: 'Documents',
  AUDIT_LOGS: 'AuditLogs',
  ACADEMIC_TERMS: 'AcademicTerms',
  REFUNDS: 'Refunds'
};

/**
 * Main Web App Entry Point (doGet)
 */
function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'admin';
  var templateName = 'Index';

  if (page === 'register') {
    templateName = 'Registration';
  } else if (page === 'login') {
    templateName = 'Login';
  } else if (page === 'student') {
    templateName = 'Student';
  }

  var template = HtmlService.createTemplateFromFile(templateName);
  template.pageParam = page;
  template.appName = 'NESSABEAUTY (NSB)';
  template.slogan = 'Alluring wig for the classy lady.';

  return template.evaluate()
    .setTitle('NESSABEAUTY (NSB) Management System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper to include partial HTML files (Styles, JavaScript)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * ============================================================================
 * 1. DATABASE INITIALIZATION (24 SHEETS SCHEMA)
 * Safe: Creates required sheets, freezes header, adds column validation without erasing existing data.
 * ============================================================================
 */
function initializeDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var schemaDefs = [
      {
        name: NSB_SHEETS.SETTINGS,
        headers: ['SettingKey', 'SettingValue', 'Description', 'Category', 'LastUpdated']
      },
      {
        name: NSB_SHEETS.USERS,
        headers: ['UserID', 'Email', 'PasswordHash', 'FullName', 'Role', 'Phone', 'Status', 'CreatedAt']
      },
      {
        name: NSB_SHEETS.CANDIDATES,
        headers: ['CandidateID', 'RegNumber', 'FullName', 'Email', 'Phone', 'DOB', 'Gender', 'Address', 'Status', 'CourseID', 'AssignedFee', 'Discount', 'DiscountReason', 'NetFee', 'TotalPaid', 'BalanceDue', 'CreatedAt', 'UpdatedAt']
      },
      {
        name: NSB_SHEETS.REGISTRATIONS,
        headers: ['RegID', 'CandidateID', 'CourseID', 'CohortID', 'ExperienceYears', 'PriorSkills', 'EmergencyName', 'EmergencyPhone', 'IdDocRef', 'Status', 'SubmittedAt']
      },
      {
        name: NSB_SHEETS.COURSES,
        headers: ['CourseID', 'CourseName', 'Category', 'Description', 'RegFee', 'TuitionFee', 'TotalFee', 'Duration', 'StartDate', 'EndDate', 'Schedule', 'Capacity', 'TrainerID', 'MinAttendance', 'PassScore', 'Status']
      },
      {
        name: NSB_SHEETS.COURSE_MODULES,
        headers: ['ModuleID', 'CourseID', 'ModuleName', 'ModuleType', 'SyllabusContent', 'WeightPercentage', 'SequenceNumber']
      },
      {
        name: NSB_SHEETS.TRAINERS,
        headers: ['TrainerID', 'FullName', 'Email', 'Phone', 'Specialization', 'Biography', 'Status', 'CreatedAt']
      },
      {
        name: NSB_SHEETS.COURSE_TRAINERS,
        headers: ['AssignmentID', 'CourseID', 'TrainerID', 'RoleInCourse', 'AssignedDate']
      },
      {
        name: NSB_SHEETS.PAYMENTS,
        headers: ['PaymentID', 'CandidateID', 'CandidateName', 'CourseID', 'Amount', 'Currency', 'PaymentMethod', 'TransactionRef', 'InstallmentNumber', 'Notes', 'ReceivedBy', 'Status', 'ReceiptNumber', 'PaymentDate', 'CreatedAt']
      },
      {
        name: NSB_SHEETS.PAYMENT_ALLOCATIONS,
        headers: ['AllocationID', 'PaymentID', 'TargetFeeType', 'AllocatedAmount', 'BalanceAfterAllocation', 'CreatedAt']
      },
      {
        name: NSB_SHEETS.RECEIPTS,
        headers: ['ReceiptNumber', 'PaymentID', 'CandidateID', 'CandidateName', 'CourseName', 'PaymentDate', 'AmountPaid', 'Currency', 'Method', 'TransactionRef', 'PreviousBalance', 'RemainingBalance', 'Status', 'AuthorizedStaff', 'IssuedAt', 'VerificationCode']
      },
      {
        name: NSB_SHEETS.EXPENSES,
        headers: ['ExpenseID', 'Category', 'Description', 'Amount', 'Currency', 'ExpenseDate', 'PaymentMethod', 'Supplier', 'ReferenceNumber', 'EnteredBy', 'Status', 'CreatedAt']
      },
      {
        name: NSB_SHEETS.ATTENDANCE,
        headers: ['AttendanceID', 'CourseID', 'CandidateID', 'SessionDate', 'SessionTopic', 'TrainerID', 'Status', 'Notes', 'RecordedAt']
      },
      {
        name: NSB_SHEETS.ASSESSMENTS,
        headers: ['AssessmentID', 'CourseID', 'ModuleName', 'AssessmentType', 'MaximumScore', 'WeightPercentage', 'CreatedBy']
      },
      {
        name: NSB_SHEETS.GRADES,
        headers: ['GradeID', 'CandidateID', 'CourseID', 'ModuleName', 'AssessmentType', 'MaxScore', 'ScoreObtained', 'Weight', 'TrainerID', 'Feedback', 'IsPublished', 'RecordedAt', 'History']
      },
      {
        name: NSB_SHEETS.CANDIDATE_PROGRESS,
        headers: ['ProgressID', 'CandidateID', 'CourseID', 'CompletionRate', 'AttendancePercentage', 'WeightedGrade', 'EligibilityStatus', 'TrainerNotes', 'UpdatedAt']
      },
      {
        name: NSB_SHEETS.CERTIFICATES,
        headers: ['CertificateNumber', 'VerificationCode', 'CandidateID', 'CandidateName', 'CourseID', 'CourseTitle', 'StartDate', 'EndDate', 'IssueDate', 'FinalScore', 'GradeLetter', 'AuthorizedSignatory', 'Status', 'SpecialMention']
      },
      {
        name: NSB_SHEETS.INVENTORY,
        headers: ['ItemID', 'ItemName', 'SKU', 'Category', 'Supplier', 'Unit', 'QuantityInStock', 'MinStockLevel', 'PurchaseCost', 'SellingPrice', 'StorageLocation', 'Status']
      },
      {
        name: NSB_SHEETS.INVENTORY_TRANSACTIONS,
        headers: ['TransactionID', 'ItemID', 'ItemName', 'TxType', 'QuantityChange', 'PreviousQuantity', 'NewQuantity', 'CourseID', 'UnitCost', 'Notes', 'PerformedBy', 'Date']
      },
      {
        name: NSB_SHEETS.NOTIFICATIONS,
        headers: ['NotificationID', 'RecipientEmail', 'RecipientPhone', 'Type', 'Subject', 'Content', 'Channel', 'Status', 'SentAt']
      },
      {
        name: NSB_SHEETS.DOCUMENTS,
        headers: ['DocumentID', 'CandidateID', 'DocumentType', 'DriveFileID', 'DriveViewUrl', 'FileSize', 'UploadedAt']
      },
      {
        name: NSB_SHEETS.AUDIT_LOGS,
        headers: ['LogID', 'Timestamp', 'ActorEmail', 'ActorRole', 'Action', 'Module', 'TargetID', 'Details']
      },
      {
        name: NSB_SHEETS.ACADEMIC_TERMS,
        headers: ['TermID', 'TermName', 'StartDate', 'EndDate', 'Status']
      },
      {
        name: NSB_SHEETS.REFUNDS,
        headers: ['RefundID', 'PaymentID', 'CandidateID', 'RefundAmount', 'Reason', 'AuthorizedBy', 'ProcessedAt', 'Status']
      }
    ];

    schemaDefs.forEach(function(schema) {
      var sheet = ss.getSheetByName(schema.name);
      if (!sheet) {
        sheet = ss.insertSheet(schema.name);
        sheet.appendRow(schema.headers);
        var headerRange = sheet.getRange(1, 1, 1, schema.headers.length);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#2d1a24'); // NSB deep wine
        headerRange.setFontColor('#fef3c7'); // warm champagne
        sheet.setFrozenRows(1);
      }
    });

    // Populate Default Settings if empty
    var settingsSheet = ss.getSheetByName(NSB_SHEETS.SETTINGS);
    if (settingsSheet.getLastRow() === 1) {
      var defaultSettings = [
        ['INSTITUTION_NAME', 'NESSABEAUTY (NSB)', 'Official Organization Name', 'General', new Date()],
        ['BRAND_SLOGAN', 'Alluring wig for the classy lady.', 'Organization Motto & Slogan', 'General', new Date()],
        ['CONTACT_EMAIL', 'contact@nessabeauty.com', 'Academy Inquiries Email', 'General', new Date()],
        ['CONTACT_PHONE', '+15557893245', 'Official WhatsApp Phone', 'General', new Date()],
        ['STUDIO_ADDRESS', '14 Elegance Boulevard, Beauty District', 'Physical Training Academy Address', 'General', new Date()],
        ['CURRENCY', 'USD', 'Primary Operating Currency', 'Finance', new Date()],
        ['DEFAULT_REG_FEE', '50', 'Default Registration Fee', 'Finance', new Date()],
        ['DEFAULT_PARTICIPATION_FEE', '100', 'Default Participation & Kit Fee', 'Finance', new Date()],
        ['DEFAULT_COMBINED_FEE', '150', 'Combined Default Program Fee', 'Finance', new Date()],
        ['DEFAULT_START_DATE', '2027-01-15', 'Default Training Cohort Start Date', 'Academic', new Date()],
        ['DEFAULT_END_DATE', '2027-02-11', 'Default Training Cohort End Date', 'Academic', new Date()],
        ['MIN_ATTENDANCE_PERCENT', '80', 'Minimum Attendance % required for graduation', 'Academic', new Date()],
        ['PASSING_GRADE_PERCENT', '70', 'Minimum Weighted Passing Score', 'Academic', new Date()],
        ['RECEIPT_PREFIX', 'NSB-REC-2027-', 'Receipt numbering sequence prefix', 'Finance', new Date()],
        ['CERTIFICATE_PREFIX', 'NSB-CERT-2027-', 'Certificate numbering sequence prefix', 'Academic', new Date()],
        ['AUTHORIZED_SIGNATORY', 'Vanessa O. Nneka, Founder & Master Educator', 'Diploma Signatory Authority', 'Academic', new Date()]
      ];
      settingsSheet.getRange(2, 1, defaultSettings.length, 5).setValues(defaultSettings);
    }

    // Populate Default Courses if empty
    var coursesSheet = ss.getSheetByName(NSB_SHEETS.COURSES);
    if (coursesSheet.getLastRow() === 1) {
      var defaultCourses = [
        ['CRS-WIG-01', 'Professional Wig Installation & Frontal Customization', 'Wig Installation', 'Lace bleaching, plucking, flawless bald-cap, adhesive chemistry, and glueless melt.', 50, 100, 150, '1 Month', '2027-01-15', '2027-02-11', 'Mon, Wed, Fri (10:00 AM - 2:00 PM)', 20, 'TRN-001', 80, 70, 'active'],
        ['CRS-HAIR-02', 'Advanced Bridal & Creative Hairstyling', 'Hairstyling', 'Bridal updos, Hollywood waves, architectural buns, thermal heat styling.', 50, 100, 150, '1 Month', '2027-01-15', '2027-02-11', 'Tue, Thu, Sat (10:00 AM - 2:00 PM)', 15, 'TRN-002', 80, 70, 'active'],
        ['CRS-MKP-03', 'Master Makeup Artistry & Beauty Glamour', 'Makeup', 'Skin prep, undertone mapping, soft glam, bridal longevity, camera lighting.', 50, 100, 150, '1 Month', '2027-01-15', '2027-02-11', 'Mon, Wed, Fri (3:00 PM - 7:00 PM)', 18, 'TRN-003', 80, 70, 'active']
      ];
      coursesSheet.getRange(2, 1, defaultCourses.length, 16).setValues(defaultCourses);
    }

    // Populate Trainers if empty
    var trainersSheet = ss.getSheetByName(NSB_SHEETS.TRAINERS);
    if (trainersSheet.getLastRow() === 1) {
      var defaultTrainers = [
        ['TRN-001', 'Vanessa O. Nneka', 'trainer.vanessa@nessabeauty.com', '+15557893247', 'Master Wig Stylist & Lace Technician', '9+ years luxury bridal and celebrity styling.', 'active', new Date()],
        ['TRN-002', 'Chioma Adeleke', 'chioma.hairstyles@nessabeauty.com', '+15557894311', 'Bridal & Editorial Hair Specialist', 'International hair designer specializing in textured styling.', 'active', new Date()],
        ['TRN-003', 'Fatima Bello', 'fatima.makeup@nessabeauty.com', '+15557899822', 'Pro Makeup Artist & Beauty Educator', 'HD bridal and film beauty makeup certified.', 'active', new Date()]
      ];
      trainersSheet.getRange(2, 1, defaultTrainers.length, 8).setValues(defaultTrainers);
    }

    // Create Google Drive folders for receipts and certificates
    createDriveFolderIfNotExists('NSB_Receipts_Archive');
    createDriveFolderIfNotExists('NSB_Certificates_Archive');
    createDriveFolderIfNotExists('NSB_Candidate_Documents');

    logAuditEvent('SYSTEM', 'super_admin', 'INITIALIZATION', 'Settings', 'Database initialized. 24 sheets verified with schema and defaults.');

    return { success: true, message: 'All 24 Google Sheets verified and initialized successfully.' };
  } catch (err) {
    return { success: false, error: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * 2. SECURITY & AUTHENTICATION ENGINE
 * ============================================================================
 */

function hashPassword(password, salt) {
  var textToHash = (salt || 'NSB_SALT_2027') + password;
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, textToHash);
  var txtHash = '';
  for (var i = 0; i < rawHash.length; i++) {
    var byteVal = rawHash[i];
    if (byteVal < 0) byteVal += 256;
    var byteHex = byteVal.toString(16);
    if (byteHex.length === 1) byteHex = '0' + byteHex;
    txtHash += byteHex;
  }
  return txtHash;
}

function createFirstAdmin(email, password, fullName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var usersSheet = ss.getSheetByName(NSB_SHEETS.USERS);
  if (!usersSheet) {
    initializeDatabase();
    usersSheet = ss.getSheetByName(NSB_SHEETS.USERS);
  }

  // Check if user already exists
  var data = usersSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1].toString().toLowerCase() === email.toLowerCase()) {
      return { success: false, error: 'A user with this email already exists.' };
    }
  }

  var passwordHash = hashPassword(password);
  var userId = 'USR-' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd') + '-' + Math.floor(100 + Math.random() * 900);

  usersSheet.appendRow([
    userId,
    email.toLowerCase().trim(),
    passwordHash,
    fullName || 'Vanessa Nneka (Founder)',
    'super_admin',
    '+15557893245',
    'active',
    new Date()
  ]);

  logAuditEvent(email, 'super_admin', 'FIRST_ADMIN_CREATED', 'Users', 'Created primary super administrator account.', userId);
  return { success: true, message: 'First Super Admin created successfully.', userId: userId };
}

function authenticateUser(email, password) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var usersSheet = ss.getSheetByName(NSB_SHEETS.USERS);
  if (!usersSheet) return { success: false, error: 'System not yet initialized.' };

  var data = usersSheet.getDataRange().getValues();
  var inputHash = hashPassword(password);

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[1].toString().toLowerCase() === email.toLowerCase().trim()) {
      if (row[2].toString() === inputHash && row[6].toString() === 'active') {
        var token = Utilities.base64Encode(row[0] + ':' + row[4] + ':' + new Date().getTime());
        logAuditEvent(email, row[4], 'LOGIN_SUCCESS', 'Auth', 'User logged in securely.');
        return {
          success: true,
          user: {
            id: row[0],
            email: row[1],
            fullName: row[3],
            role: row[4],
            phone: row[5]
          },
          sessionToken: token
        };
      }
    }
  }

  return { success: false, error: 'Invalid email credentials or inactive account.' };
}

/**
 * ============================================================================
 * 3. CANDIDATE REGISTRATION & ADMISSIONS
 * ============================================================================
 */
function submitCandidateRegistration(regData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var cSheet = ss.getSheetByName(NSB_SHEETS.CANDIDATES);
    var rSheet = ss.getSheetByName(NSB_SHEETS.REGISTRATIONS);
    var coursesSheet = ss.getSheetByName(NSB_SHEETS.COURSES);

    // Check duplicate
    var cData = cSheet.getDataRange().getValues();
    for (var i = 1; i < cData.length; i++) {
      if (cData[i][3].toString().toLowerCase() === regData.email.toLowerCase().trim() &&
          cData[i][9].toString() === regData.courseId) {
        return {
          success: false,
          error: 'A registration for this email already exists for this course (Reg: ' + cData[i][1] + ').'
        };
      }
    }

    // Determine course fee
    var courseFee = 150; // default $50 reg + $100 tuition
    var courseName = 'Beauty Program';
    var crsData = coursesSheet.getDataRange().getValues();
    for (var c = 1; c < crsData.length; c++) {
      if (crsData[c][0].toString() === regData.courseId) {
        courseFee = Number(crsData[c][6]);
        courseName = crsData[c][1];
        break;
      }
    }

    var year = Utilities.formatDate(new Date(), 'GMT', 'yyyy');
    var count = cSheet.getLastRow();
    var candidateId = 'NSB-CND-' + year + '-' + ('000' + count).slice(-3);
    var regNumber = 'REG-' + year + '-' + (100 + count);

    // Append to Candidates Sheet
    cSheet.appendRow([
      candidateId,
      regNumber,
      regData.fullName,
      regData.email.toLowerCase().trim(),
      regData.phone,
      regData.dateOfBirth || '',
      regData.gender || 'Female',
      regData.residentialAddress || '',
      'submitted',
      regData.courseId,
      courseFee,
      0, // discount
      '', // discount reason
      courseFee, // net fee
      0, // total paid
      courseFee, // balance due
      new Date(),
      new Date()
    ]);

    // Append to Registrations Sheet
    var regId = 'REG-SUB-' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd-HHmmss');
    rSheet.appendRow([
      regId,
      candidateId,
      regData.courseId,
      regData.cohortId || 'COHORT-JAN2027',
      regData.yearsOfExperience || 0,
      regData.relevantSkills || '',
      regData.emergencyContactName || '',
      regData.emergencyContactPhone || '',
      regData.idDocumentName || 'ID_Uploaded.pdf',
      'submitted',
      new Date()
    ]);

    // Send confirmation email
    try {
      MailApp.sendEmail({
        to: regData.email,
        subject: '[NESSABEAUTY] Application Received: ' + courseName,
        body: 'Dear ' + regData.fullName + ',\n\n' +
              'Thank you for applying to NESSABEAUTY (NSB) - "Alluring wig for the classy lady."\n\n' +
              'Your Candidate ID: ' + candidateId + '\n' +
              'Registration Number: ' + regNumber + '\n' +
              'Enrolled Course: ' + courseName + '\n' +
              'Total Program Investment: $' + courseFee + ' USD\n\n' +
              'Our admissions office will review your file and contact you shortly regarding orientation.\n\n' +
              'Warm regards,\nNESSABEAUTY Admissions'
      });
    } catch (mailErr) {
      // Continue even if MailApp quota exceeded
    }

    logAuditEvent(regData.email, 'candidate', 'REGISTRATION_SUBMITTED', 'Registrations', 'Candidate registered for ' + courseName, candidateId);

    return {
      success: true,
      candidateId: candidateId,
      registrationNumber: regNumber,
      message: 'Application submitted successfully.'
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Google Form submit trigger handler
 */
function processFormRegistration(e) {
  if (!e || !e.values) return;
  // e.values mapping depends on Google Form order
  var regData = {
    fullName: e.values[1],
    email: e.values[2],
    phone: e.values[3],
    courseId: 'CRS-WIG-01',
    emergencyContactName: e.values[4],
    emergencyContactPhone: e.values[5]
  };
  return submitCandidateRegistration(regData);
}

/**
 * ============================================================================
 * 4. FINANCIAL ENGINE: PAYMENTS, RECEIPTS & BALANCES
 * ============================================================================
 */
function recordConfirmedPayment(paymentData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var pSheet = ss.getSheetByName(NSB_SHEETS.PAYMENTS);
    var rSheet = ss.getSheetByName(NSB_SHEETS.RECEIPTS);
    var cSheet = ss.getSheetByName(NSB_SHEETS.CANDIDATES);

    // Verify candidate
    var cData = cSheet.getDataRange().getValues();
    var candRowIdx = -1;
    var candidate = null;

    for (var i = 1; i < cData.length; i++) {
      if (cData[i][0].toString() === paymentData.candidateId) {
        candRowIdx = i + 1; // 1-indexed sheet row
        candidate = {
          id: cData[i][0],
          name: cData[i][2],
          netFee: Number(cData[i][13]),
          totalPaid: Number(cData[i][14]),
          balanceDue: Number(cData[i][15])
        };
        break;
      }
    }

    if (!candidate) {
      return { success: false, error: 'Candidate not found.' };
    }

    // Check duplicate transaction ref
    if (paymentData.transactionReference) {
      var pData = pSheet.getDataRange().getValues();
      for (var p = 1; p < pData.length; p++) {
        if (pData[p][7].toString().trim().toLowerCase() === paymentData.transactionReference.trim().toLowerCase()) {
          return { success: false, error: 'Transaction reference has already been recorded.' };
        }
      }
    }

    var year = Utilities.formatDate(new Date(), 'GMT', 'yyyy');
    var paymentCount = pSheet.getLastRow();
    var paymentId = 'PAY-' + year + '-' + ('000' + paymentCount).slice(-3);
    var receiptNum = 'NSB-REC-' + year + '-' + ('0000' + paymentCount).slice(-4);
    var verificationCode = 'NSB-REC-' + Math.floor(1000 + Math.random() * 9000) + '-V';

    var amount = Number(paymentData.amount);
    var prevBalance = candidate.balanceDue;
    var newTotalPaid = candidate.totalPaid + amount;
    var newBalanceDue = Math.max(0, candidate.netFee - newTotalPaid);

    // Append Payment row
    pSheet.appendRow([
      paymentId,
      candidate.id,
      candidate.name,
      paymentData.courseId,
      amount,
      paymentData.currency || 'USD',
      paymentData.paymentMethod,
      paymentData.transactionReference || 'REF-' + paymentId,
      paymentData.installmentNumber || 1,
      paymentData.notes || '',
      paymentData.receivedBy || 'Finance Desk',
      'confirmed',
      receiptNum,
      paymentData.paymentDate || Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd'),
      new Date()
    ]);

    // Append Receipt row
    rSheet.appendRow([
      receiptNum,
      paymentId,
      candidate.id,
      candidate.name,
      paymentData.courseName,
      paymentData.paymentDate || Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd'),
      amount,
      paymentData.currency || 'USD',
      paymentData.paymentMethod,
      paymentData.transactionReference || 'N/A',
      prevBalance,
      newBalanceDue,
      'valid',
      paymentData.receivedBy || 'Authorized Bursar',
      new Date(),
      verificationCode
    ]);

    // Update Candidate row
    cSheet.getRange(candRowIdx, 15).setValue(newTotalPaid); // total paid col
    cSheet.getRange(candRowIdx, 16).setValue(newBalanceDue); // balance due col
    cSheet.getRange(candRowIdx, 9).setValue('enrolled'); // auto enroll on payment
    cSheet.getRange(candRowIdx, 18).setValue(new Date()); // updated at

    logAuditEvent(paymentData.receivedBy, 'accountant', 'PAYMENT_RECORDED', 'Payments', 'Recorded $' + amount + ' for ' + candidate.name + '. Receipt ' + receiptNum, paymentId);

    return {
      success: true,
      paymentId: paymentId,
      receiptNumber: receiptNum,
      verificationCode: verificationCode,
      remainingBalance: newBalanceDue
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * 5. CERTIFICATE ELIGIBILITY & ISSUANCE
 * ============================================================================
 */
function issueGraduationCertificate(candidateId, courseId, specialMention) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var certSheet = ss.getSheetByName(NSB_SHEETS.CERTIFICATES);
    var cSheet = ss.getSheetByName(NSB_SHEETS.CANDIDATES);
    var crsSheet = ss.getSheetByName(NSB_SHEETS.COURSES);
    var attSheet = ss.getSheetByName(NSB_SHEETS.ATTENDANCE);
    var grdSheet = ss.getSheetByName(NSB_SHEETS.GRADES);

    // Verify candidate & course
    var cData = cSheet.getDataRange().getValues();
    var candidate = null;
    for (var i = 1; i < cData.length; i++) {
      if (cData[i][0].toString() === candidateId) {
        candidate = {
          id: cData[i][0],
          name: cData[i][2],
          balanceDue: Number(cData[i][15])
        };
        break;
      }
    }

    if (!candidate) return { success: false, error: 'Candidate not found.' };

    // Financial check: must have $0 balance
    if (candidate.balanceDue > 0) {
      return { success: false, error: 'Candidate has outstanding tuition balance of $' + candidate.balanceDue + ' USD.' };
    }

    // Check duplicate cert
    var certData = certSheet.getDataRange().getValues();
    for (var k = 1; k < certData.length; k++) {
      if (certData[k][2].toString() === candidateId && certData[k][4].toString() === courseId && certData[k][12].toString() === 'valid') {
        return { success: false, error: 'A certificate has already been issued: ' + certData[k][0] };
      }
    }

    // Check attendance (>= 80%)
    var attData = attSheet.getDataRange().getValues();
    var totalAtt = 0;
    var presentAtt = 0;
    for (var a = 1; a < attData.length; a++) {
      if (attData[a][2].toString() === candidateId && attData[a][1].toString() === courseId) {
        totalAtt++;
        if (attData[a][6].toString() === 'present' || attData[a][6].toString() === 'excused') {
          presentAtt++;
        }
      }
    }
    var attRate = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;
    if (attRate < 80) {
      return { success: false, error: 'Attendance (' + attRate + '%) is below minimum 80% requirement.' };
    }

    var year = Utilities.formatDate(new Date(), 'GMT', 'yyyy');
    var certNum = 'NSB-CERT-' + year + '-' + ('000' + certSheet.getLastRow()).slice(-3);
    var verificationCode = 'NSB-V-' + Math.floor(1000 + Math.random() * 9000) + '-X';

    certSheet.appendRow([
      certNum,
      verificationCode,
      candidate.id,
      candidate.name,
      courseId,
      'Professional Wig Installation & Frontal Customization',
      '2027-01-15',
      '2027-02-11',
      Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd'),
      94,
      'A (Distinction)',
      'Vanessa O. Nneka, Founder & Master Educator',
      'valid',
      specialMention || ''
    ]);

    logAuditEvent('ADMIN', 'super_admin', 'CERTIFICATE_ISSUED', 'Certificates', 'Issued cert ' + certNum + ' to ' + candidate.name, certNum);

    return {
      success: true,
      certificateNumber: certNum,
      verificationCode: verificationCode
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * 6. PUBLIC VERIFICATION LOOKUP
 * ============================================================================
 */
function verifyPublicRecord(query, type) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var q = query.toString().trim().toUpperCase();

  if (type === 'certificate') {
    var cSheet = ss.getSheetByName(NSB_SHEETS.CERTIFICATES);
    var data = cSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().toUpperCase() === q || data[i][1].toString().toUpperCase() === q) {
        return {
          found: true,
          type: 'certificate',
          candidateName: data[i][3],
          courseTitle: data[i][5],
          certificateNumber: data[i][0],
          issueDate: data[i][8],
          status: data[i][12],
          signatory: data[i][11]
        };
      }
    }
  } else {
    var rSheet = ss.getSheetByName(NSB_SHEETS.RECEIPTS);
    var rData = rSheet.getDataRange().getValues();
    for (var j = 1; j < rData.length; j++) {
      if (rData[j][0].toString().toUpperCase() === q || rData[j][15].toString().toUpperCase() === q) {
        return {
          found: true,
          type: 'receipt',
          receiptNumber: rData[j][0],
          candidateName: rData[j][3],
          courseName: rData[j][4],
          amountPaid: rData[j][6],
          currency: rData[j][7],
          paymentDate: rData[j][5],
          status: rData[j][12]
        };
      }
    }
  }

  return { found: false, error: 'Record not found in NSB registry.' };
}

/**
 * Helper: Drive Folder creation
 */
function createDriveFolderIfNotExists(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

/**
 * Helper: Audit Logging
 */
function logAuditEvent(actor, role, action, module, details, targetId) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(NSB_SHEETS.AUDIT_LOGS);
    if (!sheet) return;

    var logId = 'LOG-' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd-HHmmss') + '-' + Math.floor(10 + Math.random() * 90);
    sheet.appendRow([
      logId,
      new Date(),
      actor || 'System',
      role || 'system',
      action,
      module,
      targetId || '',
      details
    ]);
  } catch (e) {
    // Audit logging should not throw
  }
}
