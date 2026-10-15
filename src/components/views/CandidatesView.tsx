import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, CandidateStatus } from '../../types';
import {
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  DollarSign,
  MessageCircle,
  FileText,
  Tag,
  ShieldAlert,
  ChevronRight,
  Plus
} from 'lucide-react';

interface CandidatesViewProps {
  onRecordPaymentForCandidate?: (candidate: Candidate) => void;
  onOpenIssueCertModal?: (candidate: Candidate) => void;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  onRecordPaymentForCandidate,
  onOpenIssueCertModal
}) => {
  const { candidates, courses, updateCandidateStatus, applyDiscount, currentUser, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Discount modal state
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(20);
  const [discountReason, setDiscountReason] = useState<string>('');

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || c.courseId === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleApplyDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    if (!discountReason.trim()) {
      alert('Please state a valid reason or scholarship designation for this discount.');
      return;
    }

    applyDiscount(selectedCandidate.id, discountAmount, discountReason);
    setShowDiscountModal(false);

    // Refresh selected candidate reference
    const updated = candidates.find((c) => c.id === selectedCandidate.id);
    if (updated) setSelectedCandidate(updated);
  };

  const openWhatsApp = (phone: string, candidateName: string, courseName: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${candidateName}, this is NESSABEAUTY regarding your registration for ${courseName}.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const getStatusBadge = (status: CandidateStatus) => {
    switch (status) {
      case 'enrolled':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/60';
      case 'approved':
        return 'bg-blue-950 text-blue-300 border-blue-800/60';
      case 'completed':
        return 'bg-purple-950 text-purple-300 border-purple-800/60';
      case 'submitted':
      case 'under_review':
        return 'bg-amber-950 text-amber-300 border-amber-800/60';
      case 'waitlisted':
        return 'bg-stone-800 text-stone-300 border-stone-700';
      case 'rejected':
      case 'withdrawn':
        return 'bg-rose-950 text-rose-300 border-rose-800/60';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Admissions & Candidates Directory
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage registrations, evaluate applicant files, authorize scholarship discounts, and track enrollment.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, ID, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Application Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="enrolled">Enrolled</option>
            <option value="completed">Completed</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.split('&')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Course Enrolled</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Fee Due</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                    No candidates match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => {
                  const course = courses.find((c) => c.id === candidate.courseId);
                  return (
                    <tr
                      key={candidate.id}
                      className="hover:bg-stone-850/60 transition cursor-pointer"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 text-amber-300 flex items-center justify-center font-bold font-serif shrink-0">
                            {candidate.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-stone-100">{candidate.fullName}</div>
                            <div className="text-[11px] text-stone-400 font-mono">
                              {candidate.id} • {candidate.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-stone-200 line-clamp-1">
                          {course?.name || candidate.courseId}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {candidate.preferredSchedule || 'Standard Schedule'}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${getStatusBadge(
                            candidate.status
                          )}`}
                        >
                          {candidate.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-medium text-stone-300">
                        ${candidate.netFee}
                        {candidate.discountAmount > 0 && (
                          <span className="text-[10px] text-amber-400 block">(-${candidate.discountAmount})</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-medium text-emerald-400">
                        ${candidate.totalPaid}
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-bold">
                        {candidate.balanceDue === 0 ? (
                          <span className="text-emerald-400">Paid In Full</span>
                        ) : (
                          <span className="text-rose-400">${candidate.balanceDue}</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => openWhatsApp(candidate.phone, candidate.fullName, course?.name || 'NSB Course')}
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/40 transition"
                            title="Open WhatsApp chat"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium border border-stone-700 transition"
                          >
                            View File
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate File Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-rose-600 text-white flex items-center justify-center font-serif text-lg font-bold">
                  {selectedCandidate.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedCandidate.fullName}</h2>
                  <p className="text-xs text-stone-400 font-mono">
                    ID: {selectedCandidate.id} • Reg: {selectedCandidate.registrationNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-stone-400 hover:text-white text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            {/* Application Status Workflow Controls */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Current Status</span>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border uppercase ${getStatusBadge(selectedCandidate.status)}`}>
                  {selectedCandidate.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {selectedCandidate.status !== 'approved' && selectedCandidate.status !== 'enrolled' && (
                  <button
                    onClick={() => {
                      updateCandidateStatus(selectedCandidate.id, 'approved');
                      setSelectedCandidate({ ...selectedCandidate, status: 'approved' });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs font-semibold"
                  >
                    Approve
                  </button>
                )}

                {selectedCandidate.status !== 'enrolled' && (
                  <button
                    onClick={() => {
                      updateCandidateStatus(selectedCandidate.id, 'enrolled');
                      setSelectedCandidate({ ...selectedCandidate, status: 'enrolled' });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold"
                  >
                    Enroll Candidate
                  </button>
                )}

                {selectedCandidate.status !== 'waitlisted' && (
                  <button
                    onClick={() => {
                      updateCandidateStatus(selectedCandidate.id, 'waitlisted');
                      setSelectedCandidate({ ...selectedCandidate, status: 'waitlisted' });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
                  >
                    Waitlist
                  </button>
                )}

                {selectedCandidate.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      updateCandidateStatus(selectedCandidate.id, 'rejected');
                      setSelectedCandidate({ ...selectedCandidate, status: 'rejected' });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-medium border border-rose-800/40"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>

            {/* Financial Status & Discount Authorization */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Financial Ledger Summary</span>
                </span>
                <button
                  onClick={() => setShowDiscountModal(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
                >
                  <Tag className="w-3 h-3" />
                  <span>Apply Scholarship/Discount</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block">Catalog Fee:</span>
                  <span className="font-mono font-medium text-stone-200">${selectedCandidate.assignedFee}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Scholarship/Discount:</span>
                  <span className="font-mono font-medium text-amber-300">-${selectedCandidate.discountAmount}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Net Fee Due:</span>
                  <span className="font-mono font-bold text-white">${selectedCandidate.netFee}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Balance Outstanding:</span>
                  <span className={`font-mono font-bold ${selectedCandidate.balanceDue === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${selectedCandidate.balanceDue}
                  </span>
                </div>
              </div>

              {selectedCandidate.discountReason && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200">
                  <span className="font-semibold">Discount Note: </span>
                  {selectedCandidate.discountReason} (Authorized by: {selectedCandidate.discountAuthorizedBy})
                </div>
              )}
            </div>

            {/* Personal & Background Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800 space-y-2">
                <h4 className="font-semibold text-stone-200 border-b border-stone-800 pb-1">Contact & Residence</h4>
                <div><span className="text-stone-400">Email:</span> <span className="text-stone-200 font-mono">{selectedCandidate.email}</span></div>
                <div><span className="text-stone-400">Phone:</span> <span className="text-stone-200 font-mono">{selectedCandidate.phone}</span></div>
                <div><span className="text-stone-400">Address:</span> <span className="text-stone-200">{selectedCandidate.residentialAddress}</span></div>
                <div><span className="text-stone-400">Nationality:</span> <span className="text-stone-200">{selectedCandidate.nationality || 'Not specified'}</span></div>
              </div>

              <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800 space-y-2">
                <h4 className="font-semibold text-stone-200 border-b border-stone-800 pb-1">Emergency Contact</h4>
                <div><span className="text-stone-400">Full Name:</span> <span className="text-stone-200">{selectedCandidate.emergencyContactName}</span></div>
                <div><span className="text-stone-400">Relationship:</span> <span className="text-stone-200">{selectedCandidate.emergencyContactRelationship}</span></div>
                <div><span className="text-stone-400">Emergency Phone:</span> <span className="text-stone-200 font-mono">{selectedCandidate.emergencyContactPhone}</span></div>
                <div><span className="text-stone-400">Document Uploaded:</span> <span className="text-amber-300 font-mono">{selectedCandidate.idDocumentName}</span></div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800">
              <button
                onClick={() => {
                  const course = courses.find((c) => c.id === selectedCandidate.courseId);
                  openWhatsApp(selectedCandidate.phone, selectedCandidate.fullName, course?.name || 'NSB Course');
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Candidate</span>
              </button>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discount / Scholarship Modal */}
      {showDiscountModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Authorize Fee Adjustment / Scholarship</span>
            </h3>

            <p className="text-xs text-stone-400">
              Applying a discount recalculates the candidate's net fee and outstanding balance. A mandatory audit trail is recorded.
            </p>

            <form onSubmit={handleApplyDiscountSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Discount Amount (USD)
                </label>
                <input
                  type="number"
                  min="5"
                  max={selectedCandidate.assignedFee}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Authorization Rationale / Scholarship Grant <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  placeholder="e.g. Merit Scholarship Award for Top Portfolio Submission"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDiscountModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition"
                >
                  Confirm & Log Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
