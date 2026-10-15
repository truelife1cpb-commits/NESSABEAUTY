import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Candidate,
  CandidateStatus,
  Course,
  Trainer,
  Payment,
  Receipt,
  Expense,
  AttendanceRecord,
  AssessmentGrade,
  Certificate,
  InventoryItem,
  InventoryTransaction,
  AuditLog,
  SystemSettings
} from '../types';
import {
  initialSettings,
  initialUsers,
  initialCourses,
  initialTrainers,
  initialCandidates,
  initialPayments,
  initialReceipts,
  initialExpenses,
  initialAttendance,
  initialGrades,
  initialCertificates,
  initialInventory,
  initialInventoryTransactions,
  initialAuditLogs
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  users: User[];
  courses: Course[];
  trainers: Trainer[];
  candidates: Candidate[];
  payments: Payment[];
  receipts: Receipt[];
  expenses: Expense[];
  attendance: AttendanceRecord[];
  grades: AssessmentGrade[];
  certificates: Certificate[];
  inventory: InventoryItem[];
  inventoryTransactions: InventoryTransaction[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  
  // Actions
  registerCandidate: (data: Partial<Candidate>) => { success: boolean; candidateId?: string; error?: string };
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  applyDiscount: (id: string, discountAmount: number, reason: string) => boolean;
  recordPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'receiptNumber'>) => { success: boolean; receipt?: Receipt; error?: string };
  reversePayment: (paymentId: string, reason: string) => boolean;
  recordAttendanceSession: (records: Omit<AttendanceRecord, 'id' | 'recordedAt'>[]) => boolean;
  saveGrade: (grade: Omit<AssessmentGrade, 'id'> & { id?: string }) => boolean;
  checkCertificateEligibility: (candidateId: string, courseId: string) => {
    isEligible: boolean;
    attendancePercent: number;
    weightedGrade: number;
    balanceDue: number;
    reasons: string[];
  };
  issueCertificate: (candidateId: string, courseId: string, specialMention?: string) => { success: boolean; certificate?: Certificate; error?: string };
  recordExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => boolean;
  recordInventoryUsageOrRestock: (
    itemId: string,
    change: number,
    type: 'purchase' | 'training_usage' | 'sale' | 'damaged' | 'adjustment',
    notes: string,
    courseId?: string
  ) => boolean;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetDatabase: () => void;
  verifyCertificate: (query: string) => Certificate | null;
  verifyReceipt: (query: string) => Receipt | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'nsb_management_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [users] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(() => initialUsers[0]); // default Super Admin

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}courses`);
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [trainers] = useState<Trainer[]>(initialTrainers);

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}candidates`);
    return saved ? JSON.parse(saved) : initialCandidates;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}payments`);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}receipts`);
    return saved ? JSON.parse(saved) : initialReceipts;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}expenses`);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}attendance`);
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [grades, setGrades] = useState<AssessmentGrade[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}grades`);
    return saved ? JSON.parse(saved) : initialGrades;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}certificates`);
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}inventory`);
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}inventory_tx`);
    return saved ? JSON.parse(saved) : initialInventoryTransactions;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}audit_logs`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}courses`, JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}candidates`, JSON.stringify(candidates));
  }, [candidates]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}payments`, JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}receipts`, JSON.stringify(receipts));
  }, [receipts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}expenses`, JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}attendance`, JSON.stringify(attendance));
  }, [attendance]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}grades`, JSON.stringify(grades));
  }, [grades]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}certificates`, JSON.stringify(certificates));
  }, [certificates]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}inventory`, JSON.stringify(inventory));
  }, [inventory]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}inventory_tx`, JSON.stringify(inventoryTransactions));
  }, [inventoryTransactions]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}audit_logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action: string, module: string, details: string, targetId?: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action,
      module,
      targetId,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const setCurrentUserRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role) || {
      id: `USR-${role}`,
      name: `Demo ${role.toUpperCase()}`,
      email: `${role}@nessabeauty.com`,
      role,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(matched);
  };

  const registerCandidate = (data: Partial<Candidate>) => {
    // Check duplicates by email
    if (!data.email || !data.fullName || !data.courseId) {
      return { success: false, error: 'Full name, email address, and course selection are required.' };
    }

    const duplicate = candidates.find(
      (c) => c.email.toLowerCase() === data.email?.toLowerCase() && c.courseId === data.courseId
    );
    if (duplicate) {
      return {
        success: false,
        error: `A registration for this email already exists for this course (Registration ID: ${duplicate.registrationNumber}).`
      };
    }

    const course = courses.find((c) => c.id === data.courseId);
    const assignedFee = course ? course.totalFee : (settings.defaultRegistrationFee + settings.defaultParticipationFee);

    const year = new Date().getFullYear();
    const count = candidates.length + 1;
    const candidateId = `NSB-CND-${year}-${String(count).padStart(3, '0')}`;
    const registrationNumber = `REG-${year}-${String(100 + count)}`;

    const newCandidate: Candidate = {
      id: candidateId,
      registrationNumber,
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone || '',
      dateOfBirth: data.dateOfBirth,
      gender: data.gender || 'Female',
      nationality: data.nationality || '',
      residentialAddress: data.residentialAddress || 'Unspecified',
      status: 'submitted',
      courseId: data.courseId,
      cohortId: data.cohortId || 'COHORT-JAN2027',
      preferredSchedule: data.preferredSchedule || course?.trainingSchedule,
      previousExperience: data.previousExperience || '',
      yearsOfExperience: data.yearsOfExperience || 0,
      relevantSkills: data.relevantSkills || '',
      emergencyContactName: data.emergencyContactName || 'N/A',
      emergencyContactRelationship: data.emergencyContactRelationship || 'N/A',
      emergencyContactPhone: data.emergencyContactPhone || 'N/A',
      idDocumentName: data.idDocumentName || 'Uploaded_ID.pdf',
      certificateDocumentName: data.certificateDocumentName,
      assignedFee,
      discountAmount: 0,
      netFee: assignedFee,
      totalPaid: 0,
      balanceDue: assignedFee,
      registeredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCandidates((prev) => [newCandidate, ...prev]);
    addAuditLog('REGISTRATION_SUBMITTED', 'Registrations', `Registered candidate ${newCandidate.fullName} for course ${course?.name}`, candidateId);

    return { success: true, candidateId: newCandidate.id };
  };

  const updateCandidateStatus = (id: string, status: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, status, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );
    addAuditLog('CANDIDATE_STATUS_UPDATED', 'Candidates', `Candidate ${id} status set to ${status}`, id);
  };

  const applyDiscount = (id: string, discountAmount: number, reason: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const clampedDiscount = Math.min(discountAmount, c.assignedFee);
          const netFee = Math.max(0, c.assignedFee - clampedDiscount);
          const balanceDue = Math.max(0, netFee - c.totalPaid);
          return {
            ...c,
            discountAmount: clampedDiscount,
            discountReason: reason,
            discountAuthorizedBy: `${currentUser.name} (${currentUser.role})`,
            netFee,
            balanceDue,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
    addAuditLog('DISCOUNT_APPLIED', 'Financials', `Applied $${discountAmount} discount to candidate ${id}. Reason: ${reason}`, id);
    return true;
  };

  const recordPayment = (paymentData: Omit<Payment, 'id' | 'createdAt' | 'receiptNumber'>) => {
    const candidate = candidates.find((c) => c.id === paymentData.candidateId);
    if (!candidate) {
      return { success: false, error: 'Candidate not found.' };
    }

    // Verify duplicate transaction reference if supplied
    if (paymentData.transactionReference) {
      const duplicateRef = payments.find(
        (p) => p.transactionReference.trim().toLowerCase() === paymentData.transactionReference.trim().toLowerCase()
      );
      if (duplicateRef) {
        return {
          success: false,
          error: `Transaction reference "${paymentData.transactionReference}" has already been processed (Payment ID: ${duplicateRef.id}).`
        };
      }
    }

    const paymentId = `PAY-${new Date().getFullYear()}-${String(payments.length + 1).padStart(3, '0')}`;
    const receiptNum = `${settings.receiptNumberPrefix}${String(receipts.length + 1).padStart(4, '0')}`;
    const verificationCode = `NSB-REC-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    const newPayment: Payment = {
      ...paymentData,
      id: paymentId,
      receiptNumber: receiptNum,
      createdAt: new Date().toISOString()
    };

    const previousBalance = candidate.balanceDue;
    const remainingBalance = Math.max(0, previousBalance - paymentData.amount);

    const newReceipt: Receipt = {
      receiptNumber: receiptNum,
      paymentId: paymentId,
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      courseName: paymentData.courseName,
      paymentDate: paymentData.paymentDate,
      amountPaid: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.paymentMethod,
      transactionReference: paymentData.transactionReference,
      previousBalance,
      remainingBalance,
      status: 'valid',
      authorizedStaff: currentUser.name,
      issuedAt: new Date().toISOString(),
      verificationCode
    };

    // Update candidate's financial balance
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidate.id) {
          const updatedTotalPaid = c.totalPaid + paymentData.amount;
          const updatedBalanceDue = Math.max(0, c.netFee - updatedTotalPaid);
          const autoStatus = c.status === 'submitted' || c.status === 'approved' ? 'enrolled' : c.status;
          return {
            ...c,
            totalPaid: updatedTotalPaid,
            balanceDue: updatedBalanceDue,
            status: autoStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );

    setPayments((prev) => [newPayment, ...prev]);
    setReceipts((prev) => [newReceipt, ...prev]);

    addAuditLog(
      'PAYMENT_RECORDED',
      'Payments',
      `Recorded payment of ${paymentData.amount} ${paymentData.currency} for ${candidate.fullName}. Receipt ${receiptNum} generated.`,
      paymentId
    );

    return { success: true, receipt: newReceipt };
  };

  const reversePayment = (paymentId: string, reason: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment || payment.status === 'reversed') return false;

    // Void receipt
    setReceipts((prev) =>
      prev.map((r) => (r.paymentId === paymentId ? { ...r, status: 'voided' } : r))
    );

    // Update payment status
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'reversed' } : p))
    );

    // Adjust candidate balance safely
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === payment.candidateId) {
          const newPaid = Math.max(0, c.totalPaid - payment.amount);
          const newBalance = Math.max(0, c.netFee - newPaid);
          return { ...c, totalPaid: newPaid, balanceDue: newBalance, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );

    addAuditLog('PAYMENT_REVERSED', 'Payments', `Reversed payment ${paymentId} of ${payment.amount} ${payment.currency}. Reason: ${reason}`, paymentId);
    return true;
  };

  const recordAttendanceSession = (records: Omit<AttendanceRecord, 'id' | 'recordedAt'>[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, i) => ({
      ...r,
      id: `ATT-${Date.now().toString().slice(-6)}-${i}`,
      recordedAt: new Date().toISOString()
    }));

    // Remove duplicates for identical candidate and sessionDate
    setAttendance((prev) => {
      const filtered = prev.filter(
        (existing) =>
          !records.some((r) => r.candidateId === existing.candidateId && r.sessionDate === existing.sessionDate)
      );
      return [...newRecords, ...filtered];
    });

    addAuditLog('ATTENDANCE_RECORDED', 'Attendance', `Recorded attendance for ${records.length} candidates on ${records[0]?.sessionDate}`);
    return true;
  };

  const saveGrade = (gradeData: Omit<AssessmentGrade, 'id'> & { id?: string }) => {
    if (gradeData.id) {
      setGrades((prev) =>
        prev.map((g) => {
          if (g.id === gradeData.id) {
            const previousScore = g.scoreObtained;
            const updated = {
              ...g,
              ...gradeData,
              history: [
                ...(g.history || []),
                {
                  previousScore,
                  changedBy: currentUser.name,
                  changedAt: new Date().toISOString(),
                  reason: 'Grade update by authorized instructor'
                }
              ]
            };
            return updated;
          }
          return g;
        })
      );
      addAuditLog('GRADE_UPDATED', 'Grades', `Updated grade for assessment ${gradeData.moduleName} score: ${gradeData.scoreObtained}`, gradeData.id);
    } else {
      const id = `GRD-${Date.now().toString().slice(-6)}`;
      const newGrade: AssessmentGrade = {
        ...gradeData,
        id
      };
      setGrades((prev) => [newGrade, ...prev]);
      addAuditLog('GRADE_CREATED', 'Grades', `Added grade for candidate ${gradeData.candidateId} in ${gradeData.moduleName}: ${gradeData.scoreObtained}%`, id);
    }
    return true;
  };

  const checkCertificateEligibility = (candidateId: string, courseId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    const candidateAttendance = attendance.filter((a) => a.candidateId === candidateId && a.courseId === courseId);
    const candidateGrades = grades.filter((g) => g.candidateId === candidateId && g.courseId === courseId && g.isPublished);

    const reasons: string[] = [];

    // Attendance Calculation
    let attendancePercent = 0;
    if (candidateAttendance.length > 0) {
      const positiveCount = candidateAttendance.filter((a) => a.status === 'present' || a.status === 'excused').length;
      attendancePercent = Math.round((positiveCount / candidateAttendance.length) * 100);
    }

    if (attendancePercent < settings.minimumAttendancePercentage) {
      reasons.push(`Attendance rate (${attendancePercent}%) is below minimum requirement (${settings.minimumAttendancePercentage}%).`);
    }

    // Grades Calculation
    let weightedGrade = 0;
    if (candidateGrades.length > 0) {
      const totalWeight = candidateGrades.reduce((sum, g) => sum + g.weightPercentage, 0);
      const weightedSum = candidateGrades.reduce((sum, g) => sum + (g.scoreObtained * (g.weightPercentage / 100)), 0);
      weightedGrade = totalWeight > 0 ? Math.round((weightedSum / (totalWeight / 100))) : 0;
    } else {
      reasons.push('No published assessment grades found.');
    }

    if (weightedGrade < settings.passingGradePercentage) {
      reasons.push(`Academic score (${weightedGrade}%) is below passing threshold (${settings.passingGradePercentage}%).`);
    }

    // Financial Clearance Check
    const balanceDue = candidate ? candidate.balanceDue : 999;
    if (balanceDue > 0) {
      reasons.push(`Outstanding tuition balance of $${balanceDue} must be fully settled.`);
    }

    const isEligible = reasons.length === 0;

    return {
      isEligible,
      attendancePercent,
      weightedGrade,
      balanceDue,
      reasons
    };
  };

  const issueCertificate = (candidateId: string, courseId: string, specialMention?: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    const course = courses.find((c) => c.id === courseId);
    if (!candidate || !course) {
      return { success: false, error: 'Candidate or course not found.' };
    }

    // Verify eligibility
    const eligibility = checkCertificateEligibility(candidateId, courseId);
    if (!eligibility.isEligible) {
      return {
        success: false,
        error: `Cannot issue certificate: ${eligibility.reasons.join(' ')}`
      };
    }

    // Prevent duplicate certificate
    const existingCert = certificates.find((c) => c.candidateId === candidateId && c.courseId === courseId && c.status === 'valid');
    if (existingCert) {
      return {
        success: false,
        error: `A valid certificate has already been issued: ${existingCert.certificateNumber}`
      };
    }

    const certNum = `${settings.certificateNumberPrefix}${String(certificates.length + 1).padStart(3, '0')}`;
    const verificationCode = `NSB-V-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    const score = eligibility.weightedGrade;
    let letterGrade = 'A (Distinction)';
    if (score < 80) letterGrade = 'B (Merit)';
    if (score < 70) letterGrade = 'Pass';

    const newCert: Certificate = {
      certificateNumber: certNum,
      verificationCode,
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      courseId: course.id,
      courseTitle: course.name,
      startDate: course.startDate,
      endDate: course.endDate,
      issueDate: new Date().toISOString().split('T')[0],
      finalScore: score,
      letterGrade,
      authorizedSignatory: `${settings.authorizedSignatoryName}, ${settings.authorizedSignatoryTitle}`,
      status: 'valid',
      awardSpecialMention: specialMention || undefined
    };

    setCertificates((prev) => [newCert, ...prev]);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'completed' } : c))
    );

    addAuditLog('CERTIFICATE_ISSUED', 'Certificates', `Issued Certificate ${certNum} to ${candidate.fullName} for ${course.name}`, certNum);

    return { success: true, certificate: newCert };
  };

  const recordExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const id = `EXP-${new Date().getFullYear()}-${String(expenses.length + 1).padStart(3, '0')}`;
    const newExpense: Expense = {
      ...expenseData,
      id,
      createdAt: new Date().toISOString()
    };
    setExpenses((prev) => [newExpense, ...prev]);
    addAuditLog('EXPENSE_RECORDED', 'Accounting', `Recorded expense of $${expenseData.amount} for "${expenseData.description}" (${expenseData.category})`, id);
    return true;
  };

  const recordInventoryUsageOrRestock = (
    itemId: string,
    change: number,
    type: 'purchase' | 'training_usage' | 'sale' | 'damaged' | 'adjustment',
    notes: string,
    courseId?: string
  ) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return false;

    const previousQuantity = item.quantityInStock;
    const newQuantity = previousQuantity + change;
    if (newQuantity < 0) return false;

    const newStatus = newQuantity === 0 ? 'out_of_stock' : newQuantity <= item.minimumStockLevel ? 'low_stock' : 'in_stock';

    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantityInStock: newQuantity, status: newStatus } : i))
    );

    const txId = `TX-INV-${Date.now().toString().slice(-6)}`;
    const newTx: InventoryTransaction = {
      id: txId,
      itemId,
      itemName: item.name,
      transactionType: type,
      quantityChange: change,
      previousQuantity,
      newQuantity,
      courseId,
      unitCost: item.purchaseCost,
      notes,
      performedBy: currentUser.name,
      date: new Date().toISOString().split('T')[0]
    };

    setInventoryTransactions((prev) => [newTx, ...prev]);
    addAuditLog('INVENTORY_TRANSACTION', 'Inventory', `${type.toUpperCase()}: ${Math.abs(change)} ${item.unit}(s) of ${item.name}. New stock: ${newQuantity}`, txId);
    return true;
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addAuditLog('SETTINGS_UPDATED', 'Settings', 'System configurations and institution parameters updated.');
  };

  const resetDatabase = () => {
    localStorage.removeItem(`${STORAGE_PREFIX}settings`);
    localStorage.removeItem(`${STORAGE_PREFIX}courses`);
    localStorage.removeItem(`${STORAGE_PREFIX}candidates`);
    localStorage.removeItem(`${STORAGE_PREFIX}payments`);
    localStorage.removeItem(`${STORAGE_PREFIX}receipts`);
    localStorage.removeItem(`${STORAGE_PREFIX}expenses`);
    localStorage.removeItem(`${STORAGE_PREFIX}attendance`);
    localStorage.removeItem(`${STORAGE_PREFIX}grades`);
    localStorage.removeItem(`${STORAGE_PREFIX}certificates`);
    localStorage.removeItem(`${STORAGE_PREFIX}inventory`);
    localStorage.removeItem(`${STORAGE_PREFIX}inventory_tx`);
    localStorage.removeItem(`${STORAGE_PREFIX}audit_logs`);

    setSettings(initialSettings);
    setCourses(initialCourses);
    setCandidates(initialCandidates);
    setPayments(initialPayments);
    setReceipts(initialReceipts);
    setExpenses(initialExpenses);
    setAttendance(initialAttendance);
    setGrades(initialGrades);
    setCertificates(initialCertificates);
    setInventory(initialInventory);
    setInventoryTransactions(initialInventoryTransactions);
    setAuditLogs(initialAuditLogs);
    setCurrentUser(initialUsers[0]);
  };

  const verifyCertificate = (query: string): Certificate | null => {
    const q = query.trim().toUpperCase();
    return (
      certificates.find(
        (c) => c.certificateNumber.toUpperCase() === q || c.verificationCode.toUpperCase() === q
      ) || null
    );
  };

  const verifyReceipt = (query: string): Receipt | null => {
    const q = query.trim().toUpperCase();
    return (
      receipts.find(
        (r) => r.receiptNumber.toUpperCase() === q || r.verificationCode.toUpperCase() === q
      ) || null
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        users,
        courses,
        trainers,
        candidates,
        payments,
        receipts,
        expenses,
        attendance,
        grades,
        certificates,
        inventory,
        inventoryTransactions,
        auditLogs,
        settings,
        registerCandidate,
        updateCandidateStatus,
        applyDiscount,
        recordPayment,
        reversePayment,
        recordAttendanceSession,
        saveGrade,
        checkCertificateEligibility,
        issueCertificate,
        recordExpense,
        recordInventoryUsageOrRestock,
        updateSettings,
        resetDatabase,
        verifyCertificate,
        verifyReceipt
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
