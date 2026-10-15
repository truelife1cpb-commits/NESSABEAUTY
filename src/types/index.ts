export type UserRole = 'super_admin' | 'admin' | 'trainer' | 'accountant' | 'student';

export type CandidateStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'waitlisted'
  | 'enrolled'
  | 'completed'
  | 'withdrawn';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | 'other';
export type PaymentStatus = 'pending_verification' | 'confirmed' | 'rejected' | 'reversed' | 'refunded';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  candidateId?: string; // If student
  trainerId?: string;   // If trainer
  isActive: boolean;
  createdAt: string;
}

export interface Candidate {
  id: string; // e.g. NSB-CND-2027-001
  registrationNumber: string; // e.g. REG-2027-0101
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  residentialAddress: string;
  photoUrl?: string;
  status: CandidateStatus;
  
  // Course selection
  courseId: string;
  cohortId: string;
  preferredSchedule?: string;
  
  // Previous experience
  previousExperience?: string;
  yearsOfExperience?: number;
  relevantSkills?: string;
  
  // Emergency contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  
  // Documents
  idDocumentName?: string;
  certificateDocumentName?: string;
  
  // Financial status summary
  assignedFee: number;
  discountAmount: number;
  discountReason?: string;
  discountAuthorizedBy?: string;
  netFee: number;
  totalPaid: number;
  balanceDue: number;
  
  registeredAt: string;
  updatedAt: string;
}

export interface Course {
  id: string; // e.g. CRS-WIG-01
  name: string;
  category: 'Wig Installation' | 'Hairstyling' | 'Makeup' | 'Masterclass';
  description: string;
  defaultRegistrationFee: number; // $50 default
  defaultTuitionFee: number;      // $100 default
  totalFee: number;               // $150 default
  duration: string;               // "1 Month (4 Weeks)"
  startDate: string;              // "2027-01-15"
  endDate: string;                // "2027-02-11"
  trainingSchedule: string;       // "Mon, Wed, Fri (10:00 AM - 2:00 PM)"
  capacity: number;
  enrolledCount: number;
  leadTrainerId: string;
  theoryModules: string[];
  practicalModules: string[];
  minimumAttendancePercentage: number; // default 80%
  passingGradePercentage: number;      // default 70%
  status: 'active' | 'archived' | 'upcoming';
}

export interface Trainer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  bio: string;
  avatarUrl?: string;
  assignedCourseIds: string[];
  status: 'active' | 'inactive';
}

export interface Payment {
  id: string; // e.g. PAY-2027-001
  candidateId: string;
  candidateName: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string; // default USD
  paymentMethod: PaymentMethod;
  transactionReference: string;
  paymentDate: string;
  installmentNumber?: number;
  notes?: string;
  receivedBy: string;
  status: PaymentStatus;
  receiptNumber?: string;
  createdAt: string;
}

export interface Receipt {
  receiptNumber: string; // e.g. NSB-REC-2027-0042
  paymentId: string;
  candidateId: string;
  candidateName: string;
  courseName: string;
  paymentDate: string;
  amountPaid: number;
  currency: string;
  paymentMethod: string;
  transactionReference: string;
  previousBalance: number;
  remainingBalance: number;
  status: 'valid' | 'voided' | 'reissued';
  authorizedStaff: string;
  issuedAt: string;
  verificationCode: string;
}

export interface Expense {
  id: string; // e.g. EXP-2027-001
  category:
    | 'Training Materials'
    | 'Beauty Products'
    | 'Trainer Compensation'
    | 'Rent'
    | 'Utilities'
    | 'Marketing'
    | 'Transport'
    | 'Equipment'
    | 'Administrative'
    | 'Other';
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  supplierOrRecipient: string;
  referenceNumber: string;
  enteredBy: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  candidateId: string;
  sessionDate: string;
  sessionTopic: string;
  trainerId: string;
  status: AttendanceStatus;
  notes?: string;
  recordedAt: string;
}

export interface AssessmentGrade {
  id: string;
  candidateId: string;
  courseId: string;
  moduleName: string;
  assessmentType: 'theory' | 'practical' | 'final_exam' | 'project';
  maximumScore: number;
  scoreObtained: number;
  weightPercentage: number;
  trainerId: string;
  trainerFeedback: string;
  assessmentDate: string;
  isPublished: boolean;
  history?: Array<{
    previousScore: number;
    changedBy: string;
    changedAt: string;
    reason: string;
  }>;
}

export interface Certificate {
  certificateNumber: string; // e.g. NSB-CERT-2027-001
  verificationCode: string; // e.g. NSB-V-8942-X
  candidateId: string;
  candidateName: string;
  courseId: string;
  courseTitle: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  finalScore: number;
  letterGrade: string;
  authorizedSignatory: string;
  status: 'valid' | 'revoked' | 'reissued';
  awardSpecialMention?: string; // e.g. "Best Wig Styling Portfolio 2027"
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'Wigs & Frontals' | 'Styling Tools' | 'Hair Products' | 'Makeup Cosmetics' | 'Disposables';
  supplier: string;
  unit: string; // 'piece', 'bottle', 'box', 'set'
  quantityInStock: number;
  minimumStockLevel: number;
  purchaseCost: number;
  sellingPrice?: number;
  expiryDate?: string;
  storageLocation: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  transactionType: 'purchase' | 'training_usage' | 'sale' | 'damaged' | 'adjustment';
  quantityChange: number; // positive for additions, negative for usages
  previousQuantity: number;
  newQuantity: number;
  courseId?: string;
  unitCost?: number;
  notes: string;
  performedBy: string;
  date: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  module: string;
  targetId?: string;
  details: string;
}

export interface SystemSettings {
  institutionName: string;
  brandSlogan: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  defaultRegistrationFee: number;
  defaultParticipationFee: number;
  trainingStartDate: string;
  trainingEndDate: string;
  minimumAttendancePercentage: number;
  passingGradePercentage: number;
  receiptNumberPrefix: string;
  certificateNumberPrefix: string;
  authorizedSignatoryName: string;
  authorizedSignatoryTitle: string;
  gasWebAppUrl?: string;
  connectedSpreadsheetId?: string;
}
