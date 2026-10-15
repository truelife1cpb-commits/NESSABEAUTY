import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentMethod, Receipt } from '../../types';
import { ReceiptModal } from '../ReceiptModal';
import {
  CreditCard,
  PlusCircle,
  FileDown,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const FinancialsView: React.FC = () => {
  const {
    payments,
    candidates,
    courses,
    receipts,
    recordPayment,
    reversePayment,
    currentUser,
    settings
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showReverseModal, setShowReverseModal] = useState(false);
  const [selectedPaymentForReverse, setSelectedPaymentForReverse] = useState<Payment | null>(null);
  const [reverseReason, setReverseReason] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // Form State
  const [formCandidateId, setFormCandidateId] = useState(candidates[0]?.id || '');
  const [formAmount, setFormAmount] = useState<number>(50);
  const [formMethod, setFormMethod] = useState<PaymentMethod>('card');
  const [formRef, setFormRef] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formInstallmentNum, setFormInstallmentNum] = useState<number>(1);
  const [formNotes, setFormNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCandidateObj = candidates.find((c) => c.id === formCandidateId);
  const selectedCandidateCourse = courses.find((crs) => crs.id === selectedCandidateObj?.courseId);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.receiptNumber && p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedCandidateObj) {
      setErrorMessage('Please select a valid registered candidate.');
      return;
    }

    if (formAmount <= 0) {
      setErrorMessage('Payment amount must be greater than zero.');
      return;
    }

    const res = recordPayment({
      candidateId: selectedCandidateObj.id,
      candidateName: selectedCandidateObj.fullName,
      courseId: selectedCandidateObj.courseId,
      courseName: selectedCandidateCourse?.name || 'NSB Training Course',
      amount: formAmount,
      currency: settings.currency,
      paymentMethod: formMethod,
      transactionReference: formRef || `TX-REF-${Date.now().toString().slice(-6)}`,
      paymentDate: formDate,
      installmentNumber: formInstallmentNum,
      notes: formNotes,
      receivedBy: currentUser.name,
      status: 'confirmed'
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to record payment.');
      return;
    }

    setShowRecordModal(false);
    if (res.receipt) {
      setSelectedReceipt(res.receipt);
    }
  };

  const handleReverseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentForReverse) return;
    if (!reverseReason.trim()) {
      alert('Please provide a mandatory reversal reason.');
      return;
    }

    reversePayment(selectedPaymentForReverse.id, reverseReason);
    setShowReverseModal(false);
    setSelectedPaymentForReverse(null);
    setReverseReason('');
  };

  const handleViewReceipt = (receiptNumber?: string) => {
    if (!receiptNumber) return;
    const found = receipts.find((r) => r.receiptNumber === receiptNumber);
    if (found) {
      setSelectedReceipt(found);
    }
  };

  const exportPaymentsCSV = () => {
    const headers = ['Payment ID', 'Receipt Number', 'Candidate Name', 'Candidate ID', 'Amount', 'Currency', 'Method', 'Reference', 'Date', 'Status', 'Received By'];
    const rows = filteredPayments.map((p) => [
      p.id,
      p.receiptNumber || 'N/A',
      `"${p.candidateName}"`,
      p.candidateId,
      p.amount,
      p.currency,
      p.paymentMethod,
      `"${p.transactionReference}"`,
      p.paymentDate,
      p.status,
      `"${p.receivedBy}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NSB_Payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Payments & Collections Ledger
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manual and digital payment processing, installment tracking, verified receipts, and reversal audit trail.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportPaymentsCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition"
          >
            <FileDown className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate, receipt, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Payment Methods</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="mobile_money">Mobile Money</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="reversed">Reversed</option>
            <option value="pending_verification">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="px-4 py-3">Receipt / ID</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Method & Reference</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Receipt</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-stone-500">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-stone-850/60 transition">
                    <td className="px-4 py-3.5 font-mono">
                      <div className="font-bold text-amber-300">{payment.receiptNumber || 'No Receipt'}</div>
                      <div className="text-[10px] text-stone-500">{payment.id}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{payment.candidateName}</div>
                      <div className="text-[10px] text-stone-400">{payment.courseName}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="capitalize text-stone-200">{payment.paymentMethod.replace('_', ' ')}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{payment.transactionReference}</div>
                    </td>

                    <td className="px-4 py-3.5 text-stone-300 font-mono text-[11px]">
                      {payment.paymentDate}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-bold text-sm">
                      <span className={payment.status === 'confirmed' ? 'text-emerald-400' : 'text-stone-500 line-through'}>
                        ${payment.amount} {payment.currency}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${
                          payment.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                            : payment.status === 'reversed'
                            ? 'bg-rose-950 text-rose-300 border-rose-800/60'
                            : 'bg-amber-950 text-amber-300 border-amber-800/60'
                        }`}
                      >
                        {payment.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {payment.receiptNumber && payment.status === 'confirmed' ? (
                        <button
                          onClick={() => handleViewReceipt(payment.receiptNumber)}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 text-[11px] font-medium border border-stone-700 transition"
                        >
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-500 italic">Voided</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {payment.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            setSelectedPaymentForReverse(payment);
                            setShowReverseModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-300 transition"
                          title="Reverse / Void Payment"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Record New Tuition / Fee Payment</span>
              </h3>
              <button
                onClick={() => setShowRecordModal(false)}
                className="text-stone-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-200 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRecordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Select Registered Candidate <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formCandidateId}
                  onChange={(e) => {
                    setFormCandidateId(e.target.value);
                    const cand = candidates.find((c) => c.id === e.target.value);
                    if (cand) setFormAmount(cand.balanceDue > 0 ? cand.balanceDue : 50);
                  }}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.id}) — Outstanding: ${c.balanceDue}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCandidateObj && (
                <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 text-xs flex justify-between">
                  <span className="text-stone-400">Current Balance Due:</span>
                  <span className="font-mono font-bold text-amber-300">${selectedCandidateObj.balanceDue} USD</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Amount Paid (${settings.currency}) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Payment Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Payment Method <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="card">Card (Stripe / POS)</option>
                    <option value="bank_transfer">Bank Wire / ACH</option>
                    <option value="cash">Cash (Bursary Desk)</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Transaction Reference #
                  </label>
                  <input
                    type="text"
                    value={formRef}
                    onChange={(e) => setFormRef(e.target.value)}
                    placeholder="e.g. STRIPE_99812 / CHASE-002"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Cashier / Bursar Notes
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Installment 1 of 2 settled"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold transition"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reverse Payment Modal */}
      {showReverseModal && selectedPaymentForReverse && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              <span>Reverse / Void Confirmed Transaction</span>
            </h3>

            <p className="text-xs text-stone-300">
              Reversing payment <span className="font-mono text-amber-300 font-bold">{selectedPaymentForReverse.id}</span> (${selectedPaymentForReverse.amount}) will void receipt <span className="font-mono text-rose-400">{selectedPaymentForReverse.receiptNumber}</span> and reinstate the balance on candidate <span className="font-semibold text-white">{selectedPaymentForReverse.candidateName}</span>.
            </p>

            <form onSubmit={handleReverseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Mandatory Reversal / Void Reason <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reverseReason}
                  onChange={(e) => setReverseReason(e.target.value)}
                  placeholder="e.g. Bank chargeback / Duplicate cashier entry / Candidate requested full withdrawal"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReverseModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                >
                  Confirm Reversal & Void
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal View */}
      {selectedReceipt && (
        <ReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};
