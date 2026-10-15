import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReceiptModal } from '../ReceiptModal';
import { Receipt } from '../../types';
import {
  UserCircle,
  GraduationCap,
  CreditCard,
  ClipboardCheck,
  BookOpenCheck,
  Award,
  Sparkles,
  Printer,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StudentPortalView: React.FC = () => {
  const { candidates, courses, payments, receipts, attendance, grades, certificates, settings, currentUser } = useApp();

  // Pick student according to currentUser candidateId or default to Amara Diallo
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentUser.candidateId || candidates[0]?.id || 'NSB-CND-2027-001'
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'attendance' | 'grades' | 'certificate'>('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const student = candidates.find((c) => c.id === selectedStudentId) || candidates[0];
  const course = courses.find((crs) => crs.id === student?.courseId) || courses[0];

  const studentPayments = payments.filter((p) => p.candidateId === student?.id);
  const studentReceipts = receipts.filter((r) => r.candidateId === student?.id);
  const studentAttendance = attendance.filter((a) => a.candidateId === student?.id && a.courseId === student?.courseId);
  const studentGrades = grades.filter((g) => g.candidateId === student?.id && g.courseId === student?.courseId && g.isPublished);
  const studentCert = certificates.find((c) => c.candidateId === student?.id && c.courseId === student?.courseId && c.status === 'valid');

  // Attendance rate
  const positiveAttendance = studentAttendance.filter((a) => a.status === 'present' || a.status === 'excused').length;
  const attendanceRate = studentAttendance.length > 0 ? Math.round((positiveAttendance / studentAttendance.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-amber-900/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center font-serif text-amber-200 font-bold text-xl">
              {student?.fullName.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                {student?.fullName}
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                {student?.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-amber-300 font-mono mt-0.5">
              ID: {student?.id} • Reg: {student?.registrationNumber}
            </p>
          </div>
        </div>

        {/* Demo Candidate Switcher for Admins */}
        <div className="flex items-center space-x-2 bg-stone-950/80 border border-stone-800 rounded-xl px-3 py-2 text-xs">
          <span className="text-stone-400">View Candidate:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-stone-900 text-stone-200 rounded-lg px-2 py-1 border border-stone-700 focus:outline-none"
          >
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-stone-800 text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: UserCircle },
          { id: 'financials', label: 'Financials & Receipts', icon: CreditCard },
          { id: 'attendance', label: 'Attendance Log', icon: ClipboardCheck },
          { id: 'grades', label: 'Grades & Feedback', icon: BookOpenCheck },
          { id: 'certificate', label: 'Graduation Diploma', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition shrink-0 ${
                isActive
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
              <span className="text-xs text-stone-400 uppercase tracking-wider block">Enrolled Program</span>
              <div className="mt-2 text-sm font-bold text-white line-clamp-1">{course?.name}</div>
              <div className="text-xs text-stone-400 mt-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>{course?.duration} ({course?.startDate} – {course?.endDate})</span>
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
              <span className="text-xs text-stone-400 uppercase tracking-wider block">Tuition Status</span>
              <div className="mt-2 text-lg font-bold font-mono">
                {student?.balanceDue === 0 ? (
                  <span className="text-emerald-400">Paid in Full ($150)</span>
                ) : (
                  <span className="text-rose-400">${student?.balanceDue} Outstanding</span>
                )}
              </div>
              <div className="text-xs text-stone-400 mt-1">Paid: ${student?.totalPaid} of ${student?.netFee}</div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
              <span className="text-xs text-stone-400 uppercase tracking-wider block">Academic Progress</span>
              <div className="mt-2 text-lg font-bold font-mono text-amber-300">
                {attendanceRate}% Attendance
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {studentCert ? 'Graduation Diploma Issued' : 'In Progress'}
              </div>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-stone-800 pb-2">
              Course Schedule & Studio Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block">Class Schedule:</span>
                <span className="text-stone-200 font-semibold">{course?.trainingSchedule}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Studio Location:</span>
                <span className="text-stone-200 font-semibold">{settings.address}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Emergency Contact:</span>
                <span className="text-stone-200">{student?.emergencyContactName} ({student?.emergencyContactPhone})</span>
              </div>
              <div>
                <span className="text-stone-400 block">Academy Contact:</span>
                <span className="text-amber-300">{settings.contactPhone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Financials & Receipts */}
      {activeTab === 'financials' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                My Official Receipts & Payments
              </h3>
              <p className="text-xs text-stone-400">Download or view your verified receipts for all payments</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">Remaining Balance:</span>
              <span className={`text-base font-bold font-mono ${student?.balanceDue === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${student?.balanceDue} {settings.currency}
              </span>
            </div>
          </div>

          <div className="divide-y divide-stone-800/60">
            {studentReceipts.length === 0 ? (
              <div className="py-6 text-center text-stone-500 text-xs">
                No confirmed receipts found for this student account.
              </div>
            ) : (
              studentReceipts.map((rcp) => (
                <div key={rcp.receiptNumber} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-amber-300 text-xs">{rcp.receiptNumber}</div>
                    <div className="text-[11px] text-stone-400">
                      Paid via {rcp.paymentMethod} • Date: {rcp.paymentDate}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ${rcp.amountPaid} {rcp.currency}
                    </span>
                    <button
                      onClick={() => setSelectedReceipt(rcp)}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold border border-stone-700 transition"
                    >
                      View Receipt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Attendance Attendance Record
              </h3>
              <p className="text-xs text-stone-400">Minimum 80% attendance required for graduation certification</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">Cumulative Score:</span>
              <span className={`text-base font-bold font-mono ${attendanceRate >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {attendanceRate}%
              </span>
            </div>
          </div>

          <div className="divide-y divide-stone-800/60 text-xs">
            {studentAttendance.length === 0 ? (
              <div className="py-6 text-center text-stone-500 text-xs">
                No attendance logs found yet.
              </div>
            ) : (
              studentAttendance.map((att) => (
                <div key={att.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{att.sessionTopic}</div>
                    <div className="text-[11px] text-stone-400 font-mono">{att.sessionDate}</div>
                    {att.notes && <div className="text-[11px] text-stone-400 italic">"{att.notes}"</div>}
                  </div>
                  <div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        att.status === 'present'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : att.status === 'late'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {att.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Grades */}
      {activeTab === 'grades' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Theory & Practical Assessments
              </h3>
              <p className="text-xs text-stone-400">Evaluations by master educators</p>
            </div>
          </div>

          <div className="divide-y divide-stone-800/60 text-xs">
            {studentGrades.length === 0 ? (
              <div className="py-6 text-center text-stone-500 text-xs">
                No published assessment grades yet.
              </div>
            ) : (
              studentGrades.map((grd) => (
                <div key={grd.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-xs">{grd.moduleName}</div>
                    <div className="text-[11px] text-stone-400 capitalize">
                      {grd.assessmentType.replace('_', ' ')} • Weight: {grd.weightPercentage}%
                    </div>
                    {grd.trainerFeedback && (
                      <div className="text-[11px] text-amber-200/90 italic mt-0.5">
                        Trainer note: "{grd.trainerFeedback}"
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-400 text-base">
                      {grd.scoreObtained} / {grd.maximumScore}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Graduation Diploma */}
      {activeTab === 'certificate' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
          {studentCert ? (
            <div className="bg-stone-950 border border-amber-600/40 rounded-2xl p-6 text-center space-y-4">
              <Sparkles className="w-10 h-10 text-amber-300 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-amber-200">
                Official Diploma of Graduation
              </h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto">
                Certified for {studentCert.courseTitle} with grade {studentCert.letterGrade}.
              </p>
              <div className="font-mono text-xs text-amber-300">
                Certificate #: {studentCert.certificateNumber} • Verification Code: {studentCert.verificationCode}
              </div>
              {studentCert.awardSpecialMention && (
                <div className="text-xs font-semibold text-amber-300">
                  ★ {studentCert.awardSpecialMention} ★
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 text-xs space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="font-semibold text-stone-300">Certificate Not Yet Issued</p>
              <p className="max-w-md mx-auto">
                To qualify for graduation, you must complete the cohort, achieve at least 80% attendance, attain 70% passing grades, and clear outstanding balances.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedReceipt && (
        <ReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};
