import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  Database,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Table,
  FileSpreadsheet,
  Link2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetDatabase } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config');

  const sheetsSchema = [
    { name: 'Settings', columns: 'SettingKey, SettingValue, Description, Category, LastUpdated' },
    { name: 'Users', columns: 'UserID, Email, PasswordHash, FullName, Role, Phone, Status, CreatedAt' },
    { name: 'Candidates', columns: 'CandidateID, RegNumber, FullName, Email, Phone, DOB, Gender, Address, Status, CourseID, AssignedFee, Discount, NetFee, TotalPaid, BalanceDue, CreatedAt' },
    { name: 'Registrations', columns: 'RegID, CandidateID, CourseID, CohortID, ExperienceYears, PriorSkills, EmergencyName, EmergencyPhone, IdDocRef, Status, SubmittedAt' },
    { name: 'Courses', columns: 'CourseID, CourseName, Category, Description, RegFee, TuitionFee, TotalFee, Duration, StartDate, EndDate, Schedule, Capacity, TrainerID, MinAttendance, PassScore, Status' },
    { name: 'CourseModules', columns: 'ModuleID, CourseID, ModuleName, ModuleType, SyllabusContent, WeightPercentage, SequenceNumber' },
    { name: 'Trainers', columns: 'TrainerID, FullName, Email, Phone, Specialization, Biography, Status, CreatedAt' },
    { name: 'CourseTrainers', columns: 'AssignmentID, CourseID, TrainerID, RoleInCourse, AssignedDate' },
    { name: 'Payments', columns: 'PaymentID, CandidateID, CandidateName, CourseID, Amount, Currency, PaymentMethod, TransactionRef, InstallmentNumber, Notes, ReceivedBy, Status, ReceiptNumber, PaymentDate, CreatedAt' },
    { name: 'PaymentAllocations', columns: 'AllocationID, PaymentID, TargetFeeType, AllocatedAmount, BalanceAfterAllocation' },
    { name: 'Receipts', columns: 'ReceiptNumber, PaymentID, CandidateID, CandidateName, CourseName, PaymentDate, AmountPaid, Currency, Method, TransactionRef, PreviousBalance, RemainingBalance, Status, AuthorizedStaff, IssuedAt, VerificationCode' },
    { name: 'Expenses', columns: 'ExpenseID, Category, Description, Amount, Currency, ExpenseDate, PaymentMethod, Supplier, ReferenceNumber, EnteredBy, Status, CreatedAt' },
    { name: 'Attendance', columns: 'AttendanceID, CourseID, CandidateID, SessionDate, SessionTopic, TrainerID, Status, Notes, RecordedAt' },
    { name: 'Assessments', columns: 'AssessmentID, CourseID, ModuleName, AssessmentType, MaximumScore, WeightPercentage, CreatedBy' },
    { name: 'Grades', columns: 'GradeID, CandidateID, CourseID, ModuleName, AssessmentType, MaxScore, ScoreObtained, Weight, TrainerID, Feedback, IsPublished, RecordedAt' },
    { name: 'CandidateProgress', columns: 'ProgressID, CandidateID, CourseID, CompletionRate, AttendancePercentage, WeightedGrade, EligibilityStatus, TrainerNotes, UpdatedAt' },
    { name: 'Certificates', columns: 'CertificateNumber, VerificationCode, CandidateID, CandidateName, CourseID, CourseTitle, StartDate, EndDate, IssueDate, FinalScore, GradeLetter, AuthorizedSignatory, Status, SpecialMention' },
    { name: 'Inventory', columns: 'ItemID, ItemName, SKU, Category, Supplier, Unit, QuantityInStock, MinStockLevel, PurchaseCost, SellingPrice, StorageLocation, Status' },
    { name: 'InventoryTransactions', columns: 'TransactionID, ItemID, ItemName, TxType, QuantityChange, PreviousQuantity, NewQuantity, CourseID, UnitCost, Notes, PerformedBy, Date' },
    { name: 'Notifications', columns: 'NotificationID, RecipientEmail, RecipientPhone, Type, Subject, Content, Channel, Status, SentAt' },
    { name: 'Documents', columns: 'DocumentID, CandidateID, DocumentType, DriveFileID, DriveViewUrl, FileSize, UploadedAt' },
    { name: 'AuditLogs', columns: 'LogID, Timestamp, ActorEmail, ActorRole, Action, Module, TargetID, Details' },
    { name: 'AcademicTerms', columns: 'TermID, TermName, StartDate, EndDate, Status' },
    { name: 'Refunds', columns: 'RefundID, PaymentID, CandidateID, RefundAmount, Reason, AuthorizedBy, ProcessedAt, Status' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Settings & Google Sheets Architecture
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure institution parameters, training start/end dates, fees, and view the 24 database schemas.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'config' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-white'
            }`}
          >
            System Parameters
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'schema' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-white'
            }`}
          >
            24 Sheets Schema ({sheetsSchema.length})
          </button>
        </div>
      </div>

      {activeTab === 'config' ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Institution Identity */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Institution Identity & Branding</span>
              </h3>
              {savedNotice && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Settings Saved</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Organization Name</label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Brand Slogan</label>
                <input
                  type="text"
                  value={formData.brandSlogan}
                  onChange={(e) => setFormData({ ...formData, brandSlogan: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Academy Phone (WhatsApp)</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-medium mb-1">Physical Studio Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Program Dates & Fees Configuration */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-stone-800 pb-3">
              Cohort Schedule & Default Fee Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Registration Fee ($)</label>
                <input
                  type="number"
                  value={formData.defaultRegistrationFee}
                  onChange={(e) => setFormData({ ...formData, defaultRegistrationFee: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Participation / Kit Fee ($)</label>
                <input
                  type="number"
                  value={formData.defaultParticipationFee}
                  onChange={(e) => setFormData({ ...formData, defaultParticipationFee: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Training Start Date</label>
                <input
                  type="date"
                  value={formData.trainingStartDate}
                  onChange={(e) => setFormData({ ...formData, trainingStartDate: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Training End Date</label>
                <input
                  type="date"
                  value={formData.trainingEndDate}
                  onChange={(e) => setFormData({ ...formData, trainingEndDate: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Min Attendance (%)</label>
                <input
                  type="number"
                  value={formData.minimumAttendancePercentage}
                  onChange={(e) => setFormData({ ...formData, minimumAttendancePercentage: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Passing Grade (%)</label>
                <input
                  type="number"
                  value={formData.passingGradePercentage}
                  onChange={(e) => setFormData({ ...formData, passingGradePercentage: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-medium mb-1">Authorized Certificate Signatory</label>
                <input
                  type="text"
                  value={formData.authorizedSignatoryName}
                  onChange={(e) => setFormData({ ...formData, authorizedSignatoryName: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset database to clean default state?')) {
                  resetDatabase();
                }
              }}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-rose-300 text-xs font-semibold border border-stone-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Database to Seed State</span>
            </button>

            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/40 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      ) : (
        /* 24 Sheets Schema Viewer */
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>24-Sheet Database Architecture</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Automatically created by <code className="text-amber-300">initializeDatabase()</code> in Google Apps Script
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {sheetsSchema.map((sheet, idx) => (
              <div key={sheet.name} className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-amber-300">
                    {idx + 1}. {sheet.name}
                  </span>
                  <span className="text-[10px] text-stone-500">Sheet Tab</span>
                </div>
                <div className="text-[11px] text-stone-400 font-mono break-all leading-relaxed">
                  {sheet.columns}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
