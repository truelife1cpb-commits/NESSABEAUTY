import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Certificate, Candidate } from '../../types';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Printer,
  Sparkles,
  ShieldCheck,
  Search,
  PlusCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CertificatesView: React.FC = () => {
  const {
    certificates,
    candidates,
    courses,
    checkCertificateEligibility,
    issueCertificate,
    settings
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedCertForView, setSelectedCertForView] = useState<Certificate | null>(null);

  // Form State
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || '');
  const [specialMention, setSpecialMention] = useState('Best Frontal Melt Portfolio 2027');
  const [issueError, setIssueError] = useState<string | null>(null);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);
  const eligibility = selectedCandidate
    ? checkCertificateEligibility(selectedCandidate.id, selectedCandidate.courseId)
    : null;

  const filteredCerts = certificates.filter(
    (c) =>
      c.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.verificationCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIssueError(null);

    if (!selectedCandidate) return;

    const res = issueCertificate(selectedCandidate.id, selectedCandidate.courseId, specialMention);
    if (!res.success) {
      setIssueError(res.error || 'Failed to issue certificate.');
      return;
    }

    setShowIssueModal(false);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    if (res.certificate) {
      setSelectedCertForView(res.certificate);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Certificate & Honors Center
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Enforce academic and financial eligibility before generating official beauty diplomas with verification codes.
          </p>
        </div>

        <button
          onClick={() => {
            setIssueError(null);
            setShowIssueModal(true);
          }}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition"
        >
          <Award className="w-4 h-4" />
          <span>Issue New Certificate</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, cert #, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="text-xs text-stone-400 hidden sm:block">
          Total Issued: <span className="font-bold text-amber-300 font-mono">{certificates.length}</span>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="px-4 py-3">Certificate Number</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Course Title</th>
                <th className="px-4 py-3">Grade Awarded</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3">Verification Code</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredCerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                    No issued certificates found. Candidates must complete attendance, exams, and fee payments to qualify.
                  </td>
                </tr>
              ) : (
                filteredCerts.map((cert) => (
                  <tr key={cert.certificateNumber} className="hover:bg-stone-850/60 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-amber-300">
                      {cert.certificateNumber}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{cert.candidateName}</div>
                      {cert.awardSpecialMention && (
                        <div className="text-[10px] text-amber-300 font-medium italic">
                          ★ {cert.awardSpecialMention}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-stone-200 font-medium">
                      {cert.courseTitle}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-emerald-400">
                        {cert.finalScore}% ({cert.letterGrade})
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-stone-400 font-mono text-[11px]">
                      {cert.issueDate}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-stone-300">
                      <span className="bg-stone-800 px-2 py-0.5 rounded text-[11px] border border-stone-700">
                        {cert.verificationCode}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedCertForView(cert)}
                        className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 text-[11px] font-medium border border-stone-700 transition"
                      >
                        View Certificate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Certificate Modal with 3-Point Eligibility Checker */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Issue Official NSB Certificate</span>
              </h3>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-stone-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {issueError && (
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-200 text-xs">
                {issueError}
              </div>
            )}

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Select Candidate for Audit Verification <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.id}) — Balance: ${c.balanceDue}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3-Point Eligibility Verification Card */}
              {eligibility && (
                <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
                    <span className="font-semibold text-stone-200 uppercase tracking-wider">
                      Eligibility Audit Checklist
                    </span>
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                        eligibility.isEligible
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {eligibility.isEligible ? 'PASSED & QUALIFIED' : 'NOT YET ELIGIBLE'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Check 1: Attendance */}
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">
                        1. Minimum Attendance ({settings.minimumAttendancePercentage}% req):
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          eligibility.attendancePercent >= settings.minimumAttendancePercentage
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {eligibility.attendancePercent}%{' '}
                        {eligibility.attendancePercent >= settings.minimumAttendancePercentage ? '✓' : '✗'}
                      </span>
                    </div>

                    {/* Check 2: Academic Grade */}
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">
                        2. Academic Passing Score ({settings.passingGradePercentage}% req):
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          eligibility.weightedGrade >= settings.passingGradePercentage
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {eligibility.weightedGrade}%{' '}
                        {eligibility.weightedGrade >= settings.passingGradePercentage ? '✓' : '✗'}
                      </span>
                    </div>

                    {/* Check 3: Fee Clearance */}
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">3. Financial Clearance (Full Settlement):</span>
                      <span
                        className={`font-mono font-bold ${
                          eligibility.balanceDue === 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        ${eligibility.balanceDue} due {eligibility.balanceDue === 0 ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>

                  {!eligibility.isEligible && (
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-[11px] text-rose-300 mt-2">
                      <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-rose-400" />
                      {eligibility.reasons.join(' ')}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Special Mention / Honor Award (Optional)
                </label>
                <input
                  type="text"
                  value={specialMention}
                  onChange={(e) => setSpecialMention(e.target.value)}
                  placeholder="e.g. Valedictorian & Best Frontal Melt Portfolio 2027"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!eligibility?.isEligible}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-rose-950/50"
                >
                  Authorize & Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate Preview & Print Modal */}
      {selectedCertForView && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-800/40 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Official Diploma of Graduation
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedCertForView(null)}
                  className="text-stone-400 hover:text-white text-xl font-bold p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* The Certificate Paper Document */}
            <div
              id="printable-certificate"
              className="bg-stone-950 border-4 border-amber-600/40 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden space-y-6"
            >
              {/* Inner Decorative Border */}
              <div className="absolute inset-2 border border-amber-500/20 rounded-xl pointer-events-none" />

              {/* Seal / Crest */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-300 p-0.5 shadow-xl mx-auto flex items-center justify-center">
                <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-300" />
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-widest text-amber-200 uppercase">
                  {settings.institutionName}
                </h2>
                <p className="text-xs font-serif italic text-rose-300/90 tracking-wide mt-1">
                  "{settings.brandSlogan}"
                </p>
              </div>

              <div className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold">
                This is to officially certify that
              </div>

              <div className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide border-b border-amber-600/30 pb-2 max-w-lg mx-auto">
                {selectedCertForView.candidateName}
              </div>

              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                has successfully fulfilled all rigorous academic theory, practical laboratory requirements, and professional salon examinations in
              </p>

              <div className="text-lg sm:text-xl font-serif font-bold text-amber-300">
                {selectedCertForView.courseTitle}
              </div>

              {selectedCertForView.awardSpecialMention && (
                <div className="inline-block px-4 py-1 rounded-full bg-amber-950/70 border border-amber-700/50 text-amber-300 text-xs font-semibold">
                  ★ Distinction: {selectedCertForView.awardSpecialMention} ★
                </div>
              )}

              {/* Bottom Details & Signatures */}
              <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-300">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Certificate Number:
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    {selectedCertForView.certificateNumber}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono block">
                    Verification Code: {selectedCertForView.verificationCode}
                  </span>
                </div>

                <div className="text-center sm:text-right space-y-1">
                  <div className="font-serif italic text-amber-300 text-base">
                    {selectedCertForView.authorizedSignatory}
                  </div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-widest border-t border-stone-800 pt-1">
                    Authorized Signatory & Academic Seal
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Issued: {selectedCertForView.issueDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
