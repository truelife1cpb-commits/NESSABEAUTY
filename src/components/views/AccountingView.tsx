import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Expense, PaymentMethod } from '../../types';
import {
  DollarSign,
  PlusCircle,
  FileDown,
  TrendingUp,
  TrendingDown,
  PieChart,
  Tag,
  CheckCircle2,
  Calendar,
  Search
} from 'lucide-react';

export const AccountingView: React.FC = () => {
  const { expenses, payments, recordExpense, currentUser, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [category, setCategory] = useState<Expense['category']>('Training Materials');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(50);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [supplierOrRecipient, setSupplierOrRecipient] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  // Financial Computations
  const totalCollectedRevenue = payments
    .filter((p) => p.status === 'confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalApprovedExpenses = expenses
    .filter((e) => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const netCashMovement = totalCollectedRevenue - totalApprovedExpenses;

  // Filtered Expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.supplierOrRecipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) {
      alert('Please provide a valid description and amount.');
      return;
    }

    recordExpense({
      category,
      description,
      amount,
      currency: settings.currency,
      expenseDate,
      paymentMethod,
      supplierOrRecipient: supplierOrRecipient || 'General Supplier',
      referenceNumber: referenceNumber || `EXP-REF-${Date.now().toString().slice(-5)}`,
      enteredBy: currentUser.name,
      status: 'approved'
    });

    setShowAddModal(false);
    setDescription('');
    setAmount(50);
    setSupplierOrRecipient('');
    setReferenceNumber('');
  };

  const exportExpensesCSV = () => {
    const headers = ['Expense ID', 'Category', 'Description', 'Amount', 'Currency', 'Date', 'Supplier', 'Payment Method', 'Ref', 'Entered By'];
    const rows = filteredExpenses.map((e) => [
      e.id,
      `"${e.category}"`,
      `"${e.description}"`,
      e.amount,
      e.currency,
      e.expenseDate,
      `"${e.supplierOrRecipient}"`,
      e.paymentMethod,
      `"${e.referenceNumber}"`,
      `"${e.enteredBy}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NSB_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
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
            Financial Management & Expense Control
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Track salon overheads, material purchases, trainer honorariums, and net academy cash flow.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportExpensesCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Statement CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record New Expense</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-wider">
            <span>Collected Cash Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            ${totalCollectedRevenue.toLocaleString()} {settings.currency}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">From confirmed registrations & tuition</div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-wider">
            <span>Disbursed Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400">
            ${totalApprovedExpenses.toLocaleString()} {settings.currency}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">Materials, salon tools, facilities</div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-wider">
            <span>Net Operating Cash Flow</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`mt-2 text-2xl font-bold font-mono ${netCashMovement >= 0 ? 'text-amber-300' : 'text-red-400'}`}>
            ${netCashMovement.toLocaleString()} {settings.currency}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">Liquid balance after operations</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search description, supplier, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-auto"
        >
          <option value="all">All Expense Categories</option>
          <option value="Training Materials">Training Materials</option>
          <option value="Beauty Products">Beauty Products</option>
          <option value="Marketing">Marketing</option>
          <option value="Utilities">Utilities</option>
          <option value="Equipment">Equipment</option>
          <option value="Trainer Compensation">Trainer Compensation</option>
          <option value="Rent">Rent</option>
        </select>
      </div>

      {/* Expenses Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="px-4 py-3">Expense ID & Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Supplier / Payee</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Entered By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stone-850/60 transition">
                    <td className="px-4 py-3.5 font-mono">
                      <div className="font-bold text-stone-200">{exp.id}</div>
                      <div className="text-[10px] text-stone-500">{exp.expenseDate}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-800 text-amber-300 border border-stone-700">
                        {exp.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{exp.description}</div>
                      <div className="text-[10px] text-stone-500 font-mono">Ref: {exp.referenceNumber}</div>
                    </td>

                    <td className="px-4 py-3.5 text-stone-300 font-medium">
                      {exp.supplierOrRecipient}
                    </td>

                    <td className="px-4 py-3.5 capitalize text-stone-400">
                      {exp.paymentMethod.replace('_', ' ')}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-bold text-sm text-rose-400">
                      -${exp.amount} {exp.currency}
                    </td>

                    <td className="px-4 py-3.5 text-stone-400 text-[11px]">
                      {exp.enteredBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Record Operational Expense</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Expense Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Training Materials">Training Materials (Wigs, Frontals, Mannequins)</option>
                  <option value="Beauty Products">Beauty Products (Lace Glue, Bleach, Tints)</option>
                  <option value="Trainer Compensation">Trainer Honorarium / Compensation</option>
                  <option value="Rent">Academy Facility Rent</option>
                  <option value="Utilities">Utilities (Electricity, Wi-Fi, Water)</option>
                  <option value="Marketing">Marketing & Advertising</option>
                  <option value="Equipment">Equipment & Hot Styling Tools</option>
                  <option value="Administrative">Administrative & Office Supplies</option>
                  <option value="Other">Other Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Description / Itemized Breakdown <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Purchase of 10 HD frontals from Crown Glitz"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Amount (${settings.currency}) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Supplier / Recipient
                  </label>
                  <input
                    type="text"
                    value={supplierOrRecipient}
                    onChange={(e) => setSupplierOrRecipient(e.target.value)}
                    placeholder="e.g. Sally Beauty / Crown Glitz"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Invoice / Receipt Ref #
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. INV-99120"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="card">Company Debit/Credit Card</option>
                  <option value="bank_transfer">Bank Wire Transfer</option>
                  <option value="cash">Petty Cash</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold transition"
                >
                  Confirm Expense Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
