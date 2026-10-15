import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CreditCard,
  DollarSign,
  Award,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  PlusCircle,
  ClipboardList,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  onOpenQuickPayment?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const { candidates, payments, expenses, courses, attendance, grades, certificates, inventory, settings } = useApp();

  // Metrics
  const totalCandidates = candidates.length;
  const enrolledCandidates = candidates.filter((c) => c.status === 'enrolled' || c.status === 'completed').length;
  const pendingRegistrations = candidates.filter((c) => c.status === 'submitted' || c.status === 'under_review').length;

  const totalCollected = payments
    .filter((p) => p.status === 'confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = expenses
    .filter((e) => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const netCashMovement = totalCollected - totalExpenses;

  const totalOutstandingBalance = candidates.reduce((sum, c) => sum + c.balanceDue, 0);

  const lowStockItems = inventory.filter((i) => i.quantityInStock <= i.minimumStockLevel);

  // Overall Attendance average
  const totalAttendanceRecords = attendance.length;
  const positiveAttendance = attendance.filter((a) => a.status === 'present' || a.status === 'excused').length;
  const avgAttendance = totalAttendanceRecords > 0 ? Math.round((positiveAttendance / totalAttendanceRecords) * 100) : 0;

  // Recent payments
  const recentPayments = [...payments]
    .filter((p) => p.status === 'confirmed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Recent registrations
  const recentRegistrations = [...candidates]
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-amber-900/40 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-[11px] text-amber-300 font-medium mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Active Cohort: {settings.trainingStartDate} – {settings.trainingEndDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight">
              {settings.institutionName}
            </h1>
            <p className="text-amber-200/80 italic text-sm mt-0.5">
              "{settings.brandSlogan}"
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('registration')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>New Registration</span>
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Record Payment</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
            >
              <ClipboardList className="w-4 h-4 text-rose-400" />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Candidates */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm hover:border-stone-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Candidates</span>
            <div className="p-2 rounded-xl bg-amber-950/50 text-amber-400 border border-amber-800/40">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">{totalCandidates}</span>
            <span className="text-xs text-stone-400">total applicants</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800/60">
            <span className="text-emerald-400 font-medium">{enrolledCandidates} Enrolled</span>
            <span className="text-amber-400 font-medium">{pendingRegistrations} Pending Review</span>
          </div>
        </div>

        {/* Revenue Collected */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm hover:border-stone-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Confirmed Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">${totalCollected.toLocaleString()}</span>
            <span className="text-xs text-stone-400">{settings.currency}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800/60">
            <span>Outstanding Balance</span>
            <span className="text-rose-400 font-medium font-mono">${totalOutstandingBalance}</span>
          </div>
        </div>

        {/* Net Cash Movement */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm hover:border-stone-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Net Cash Flow</span>
            <div className="p-2 rounded-xl bg-rose-950/50 text-rose-400 border border-rose-800/40">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-2xl font-bold font-mono ${netCashMovement >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>
              ${netCashMovement.toLocaleString()}
            </span>
            <span className="text-xs text-stone-400">after expenses</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800/60">
            <span>Expenses Paid</span>
            <span className="text-stone-300 font-mono">${totalExpenses}</span>
          </div>
        </div>

        {/* Academic & Certs */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm hover:border-stone-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Completion & Certs</span>
            <div className="p-2 rounded-xl bg-amber-950/50 text-amber-300 border border-amber-800/40">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-200 font-mono">{certificates.length}</span>
            <span className="text-xs text-stone-400">certificates issued</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800/60">
            <span>Avg Attendance</span>
            <span className="text-amber-300 font-semibold">{avgAttendance}%</span>
          </div>
        </div>
      </div>

      {/* Alert if low stock */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-700/60 rounded-2xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-amber-200">Inventory Alert: </span>
              <span className="text-amber-300/90">
                {lowStockItems.map((i) => `${i.name} (${i.quantityInStock} ${i.unit}s remaining)`).join(', ')}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="px-3 py-1 bg-amber-800/60 hover:bg-amber-700 text-amber-100 rounded-lg font-medium transition shrink-0 ml-3"
          >
            Manage Stock
          </button>
        </div>
      )}

      {/* Two-column layout for Recent Admissions and Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Recent Registrations</h2>
              <p className="text-xs text-stone-400">Newly submitted applicant files</p>
            </div>
            <button
              onClick={() => setActiveTab('candidates')}
              className="text-xs text-amber-400 hover:text-amber-300 transition font-medium"
            >
              View All ({candidates.length}) &rarr;
            </button>
          </div>

          <div className="divide-y divide-stone-800/60">
            {recentRegistrations.map((candidate) => {
              const course = courses.find((c) => c.id === candidate.courseId);
              return (
                <div key={candidate.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center font-serif text-amber-300 font-bold text-xs shrink-0 border border-stone-700">
                      {candidate.fullName.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-stone-200 truncate">{candidate.fullName}</div>
                      <div className="text-[11px] text-stone-400 truncate">{course?.name || candidate.courseId}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                        candidate.status === 'enrolled'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : candidate.status === 'approved'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                          : candidate.status === 'submitted' || candidate.status === 'under_review'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {candidate.status.replace('_', ' ')}
                    </span>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {candidate.registrationNumber}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Confirmed Collections */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Confirmed Payments</h2>
              <p className="text-xs text-stone-400">Official cash & digital collections</p>
            </div>
            <button
              onClick={() => setActiveTab('financials')}
              className="text-xs text-amber-400 hover:text-amber-300 transition font-medium"
            >
              View All ({payments.length}) &rarr;
            </button>
          </div>

          <div className="divide-y divide-stone-800/60">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-8 h-8 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-stone-200 truncate">{payment.candidateName}</div>
                    <div className="text-[11px] text-stone-400 truncate">
                      {payment.paymentMethod.replace('_', ' ')} • Ref: {payment.transactionReference}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    +${payment.amount} {payment.currency}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    {payment.receiptNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Courses & Capacity */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Active Training Courses & Cohorts</h2>
            <p className="text-xs text-stone-400">Class capacity and enrollment quotas</p>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="text-xs text-amber-400 hover:text-amber-300 transition font-medium"
          >
            Manage Courses &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => {
            const enrolled = candidates.filter((c) => c.courseId === course.id && (c.status === 'enrolled' || c.status === 'completed')).length;
            const percentFilled = Math.min(100, Math.round((enrolled / course.capacity) * 100));

            return (
              <div key={course.id} className="bg-stone-950/70 border border-stone-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-amber-400/90 font-medium">
                    <span>{course.category}</span>
                    <span className="font-mono">${course.totalFee} {settings.currency}</span>
                  </div>
                  <h3 className="text-xs font-bold text-stone-200 mt-1 line-clamp-1">{course.name}</h3>
                  <p className="text-[11px] text-stone-400 mt-1 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-stone-500" />
                    <span>{course.duration} ({course.startDate})</span>
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span>Enrolled: {enrolled} / {course.capacity}</span>
                    <span className="font-semibold text-stone-300">{percentFilled}%</span>
                  </div>
                  <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
