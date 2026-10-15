import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Certificate, Receipt } from '../../types';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  CreditCard,
  Sparkles
} from 'lucide-react';

export const PublicVerificationView: React.FC = () => {
  const { verifyCertificate, verifyReceipt, settings } = useApp();

  const [verifyType, setVerifyType] = useState<'certificate' | 'receipt'>('certificate');
  const [query, setQuery] = useState('');
  const [resultCert, setResultCert] = useState<Certificate | null>(null);
  const [resultReceipt, setResultReceipt] = useState<Receipt | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    if (verifyType === 'certificate') {
      const res = verifyCertificate(query);
      setResultCert(res);
      setResultReceipt(null);
    } else {
      const res = verifyReceipt(query);
      setResultReceipt(res);
      setResultCert(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/50 text-xs font-semibold text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AUTHENTICITY VERIFICATION PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Verify NSB Academic & Financial Records
        </h1>
        <p className="text-xs text-stone-400 max-w-lg mx-auto">
          Public verification system ensuring the validity of official NESSABEAUTY graduation certificates and fee collection receipts.
        </p>
      </div>

      {/* Verification Query Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-center space-x-3 border-b border-stone-800 pb-4">
          <button
            type="button"
            onClick={() => {
              setVerifyType('certificate');
              setHasSearched(false);
              setQuery('NSB-CERT-2027-001');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              verifyType === 'certificate'
                ? 'bg-amber-600 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Verify Certificate</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setVerifyType('receipt');
              setHasSearched(false);
              setQuery('NSB-REC-2027-0001');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              verifyType === 'receipt'
                ? 'bg-amber-600 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Verify Receipt</span>
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5 text-center">
              {verifyType === 'certificate'
                ? 'Enter Certificate Number (e.g. NSB-CERT-2027-001) or Verification Code (NSB-V-8942-X)'
                : 'Enter Receipt Number (e.g. NSB-REC-2027-0001) or Verification Code'}
            </label>
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={verifyType === 'certificate' ? 'NSB-CERT-2027-001' : 'NSB-REC-2027-0001'}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-center text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono uppercase tracking-wider"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-rose-950/40 transition shrink-0"
              >
                Verify
              </button>
            </div>
          </div>
        </form>

        {/* Verification Result Display */}
        {hasSearched && (
          <div className="pt-4 border-t border-stone-800">
            {verifyType === 'certificate' ? (
              resultCert ? (
                <div className="bg-stone-950 border border-emerald-800/60 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    Authentic NSB Credential Verified
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    {resultCert.candidateName}
                  </h3>
                  <p className="text-xs text-stone-300">
                    Course: <span className="font-semibold text-amber-300">{resultCert.courseTitle}</span>
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400 pt-2 border-t border-stone-800/80 font-mono">
                    <span>Cert #: {resultCert.certificateNumber}</span>
                    <span>Issued: {resultCert.issueDate}</span>
                    <span>Signatory: {resultCert.authorizedSignatory}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-950 border border-rose-800/60 rounded-2xl p-6 text-center space-y-2">
                  <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                    Record Not Found
                  </div>
                  <p className="text-xs text-stone-400">
                    No certificate matching "{query}" was found in the official registry. Please check the code or contact NESSABEAUTY.
                  </p>
                </div>
              )
            ) : resultReceipt ? (
              <div className="bg-stone-950 border border-emerald-800/60 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Valid Electronic Receipt Verified
                </div>
                <h3 className="text-lg font-serif font-bold text-white">
                  {resultReceipt.receiptNumber}
                </h3>
                <p className="text-xs text-stone-300">
                  Paid by: <span className="font-semibold text-white">{resultReceipt.candidateName}</span> for{' '}
                  <span className="text-amber-300">{resultReceipt.courseName}</span>
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400 pt-2 border-t border-stone-800/80 font-mono">
                  <span>Amount: ${resultReceipt.amountPaid} {resultReceipt.currency}</span>
                  <span>Date: {resultReceipt.paymentDate}</span>
                  <span>Method: {resultReceipt.paymentMethod}</span>
                </div>
              </div>
            ) : (
              <div className="bg-stone-950 border border-rose-800/60 rounded-2xl p-6 text-center space-y-2">
                <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
                <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                  Receipt Not Found
                </div>
                <p className="text-xs text-stone-400">
                  No payment receipt matching "{query}" was found.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
