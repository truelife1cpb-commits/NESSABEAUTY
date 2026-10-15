import React from 'react';
import { Receipt } from '../types';
import { useApp } from '../context/AppContext';
import { Sparkles, Printer, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface ReceiptModalProps {
  receipt: Receipt;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  const { settings } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Official Electronic Receipt
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white text-xl font-bold p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div
          id="printable-receipt"
          className="bg-stone-950 text-stone-100 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
        >
          {/* Subtle Watermark */}
          <div className="absolute right-4 bottom-8 opacity-5 font-serif text-8xl font-black pointer-events-none select-none">
            NSB
          </div>

          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-800 pb-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif tracking-wider text-xl font-bold text-amber-200">
                  {settings.institutionName}
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 italic mt-0.5">
                "{settings.brandSlogan}"
              </p>
              <p className="text-[10px] text-stone-400 mt-1">
                {settings.address} • {settings.contactPhone}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">
                Official Receipt
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {receipt.receiptNumber}
              </span>
              <div className="text-[10px] text-stone-400 mt-1 font-mono">
                Date: {receipt.paymentDate}
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/40 rounded-xl px-4 py-2 text-xs">
            <span className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>STATUS: CONFIRMED & AUDITED</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-300">
              Code: {receipt.verificationCode}
            </span>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Candidate Name:</span>
              <span className="font-bold text-white text-sm">{receipt.candidateName}</span>
              <span className="text-stone-400 block text-[11px] font-mono">ID: {receipt.candidateId}</span>
            </div>

            <div className="text-right">
              <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Course / Program:</span>
              <span className="font-medium text-stone-200">{receipt.courseName}</span>
            </div>

            <div>
              <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Payment Method:</span>
              <span className="text-stone-200 capitalize">{receipt.paymentMethod.replace('_', ' ')}</span>
            </div>

            <div className="text-right">
              <span className="text-stone-400 text-[10px] uppercase tracking-wider block">Reference / Auth:</span>
              <span className="text-stone-300 font-mono text-[11px]">{receipt.transactionReference || 'N/A'}</span>
            </div>
          </div>

          {/* Balance Breakdown Table */}
          <div className="border border-stone-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] border-b border-stone-800">
                <tr>
                  <th className="px-4 py-2">Account Description</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-900">
                <tr>
                  <td className="px-4 py-2 text-stone-300">Previous Balance Due</td>
                  <td className="px-4 py-2 text-right font-mono text-stone-300">
                    ${receipt.previousBalance.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-emerald-950/20 font-semibold">
                  <td className="px-4 py-2.5 text-emerald-300 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Amount Paid (This Transaction)</span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-emerald-400 text-sm">
                    ${receipt.amountPaid.toFixed(2)} {receipt.currency}
                  </td>
                </tr>
                <tr className="font-bold">
                  <td className="px-4 py-2.5 text-stone-200">Remaining Balance Outstanding</td>
                  <td className="px-4 py-2.5 text-right font-mono text-amber-300">
                    ${receipt.remainingBalance.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Authorized Signature Footer */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Authorized Staff:</span>
              <span className="text-stone-300 font-medium">{receipt.authorizedStaff}</span>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-amber-300 text-sm tracking-wider">
                {settings.authorizedSignatoryName}
              </div>
              <span className="text-[10px] text-stone-400 block">Official Bursary Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
