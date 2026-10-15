import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search, Shield, Filter } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetId && log.targetId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;

    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            System Security & Audit Trail
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Immutable log tracking every financial modification, grade entry, certificate issuance, and status change.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs text-emerald-300 font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>Audit Logging Active (Sheet #22)</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, actor, details, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-auto"
        >
          <option value="all">All System Modules</option>
          <option value="Registrations">Registrations</option>
          <option value="Payments">Payments</option>
          <option value="Financials">Financials & Discounts</option>
          <option value="Accounting">Accounting & Expenses</option>
          <option value="Attendance">Attendance</option>
          <option value="Grades">Grades & Assessments</option>
          <option value="Certificates">Certificates</option>
          <option value="Inventory">Inventory</option>
          <option value="Settings">Settings & Schema</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor & Role</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Target ID</th>
                <th className="px-4 py-3">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-850/60 transition">
                  <td className="px-4 py-3 text-stone-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-white">{log.actorEmail}</div>
                    <div className="text-[10px] text-amber-400 uppercase">{log.actorRole}</div>
                  </td>

                  <td className="px-4 py-3 font-bold text-amber-200 whitespace-nowrap">
                    {log.action}
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-800 text-stone-300 border border-stone-700">
                      {log.module}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-stone-400 whitespace-nowrap">
                    {log.targetId || '—'}
                  </td>

                  <td className="px-4 py-3 font-sans text-stone-300 text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
