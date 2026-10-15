import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Sparkles,
  UserCheck,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  isMobileMenuOpen,
  setActiveTab
}) => {
  const { currentUser, setCurrentUserRole, settings, resetDatabase } = useApp();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentUserRole(e.target.value as UserRole);
  };

  const handleResetConfirm = () => {
    if (window.confirm('Reset database to clean initial state with pre-configured Jan 2027 NSB courses and sample data?')) {
      resetDatabase();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-amber-900/30 text-stone-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif tracking-wider text-xl font-bold bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 bg-clip-text text-transparent">
                NESSABEAUTY
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/50 font-mono tracking-tighter">
                NSB
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70 italic tracking-wide font-light hidden sm:block">
              {settings.brandSlogan}
            </p>
          </div>
        </div>

        {/* Quick action shortcuts */}
        <div className="hidden lg:flex items-center space-x-2 text-xs">
          <button
            onClick={() => setActiveTab('registration')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700/80 text-stone-300 hover:text-white transition border border-stone-700/60"
            title="Open Public Candidate Registration Form"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Public Registration</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700/80 text-stone-300 hover:text-white transition border border-stone-700/60"
            title="Public Verification for Certificates & Receipts"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Verify Cert/Receipt</span>
          </button>

          <button
            onClick={() => setActiveTab('gas_hub')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-700/50 transition font-medium"
            title="View & Copy Google Apps Script files"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
            <span>GAS Code & Deployment</span>
          </button>
        </div>

        {/* User Role Switcher & Profile */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-stone-800/90 border border-stone-700/80 rounded-xl px-2.5 py-1.5">
            <UserCheck className="w-4 h-4 text-amber-400 hidden sm:block" />
            <div className="text-left mr-1 hidden md:block">
              <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">Role Preview</div>
              <div className="text-xs font-medium text-stone-200">{currentUser.name.split(' ')[0]}</div>
            </div>
            <select
              value={currentUser.role}
              onChange={handleRoleChange}
              className="bg-stone-900 text-amber-300 text-xs font-medium rounded-lg px-2 py-1 border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="super_admin">Super Admin / Owner</option>
              <option value="admin">Administrator</option>
              <option value="trainer">Trainer / Instructor</option>
              <option value="accountant">Accountant / Finance</option>
              <option value="student">Student / Candidate</option>
            </select>
          </div>

          <button
            onClick={handleResetConfirm}
            className="p-2 text-stone-400 hover:text-rose-300 hover:bg-stone-800 rounded-lg transition"
            title="Reset Database to Clean Default State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
