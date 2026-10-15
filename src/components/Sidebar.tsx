import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  ClipboardCheck,
  Award,
  BookOpenCheck,
  DollarSign,
  PackageCheck,
  MessageSquareShare,
  History,
  Settings,
  Code2,
  UserCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { currentUser, candidates, payments, inventory } = useApp();

  const pendingApplications = candidates.filter(
    (c) => c.status === 'submitted' || c.status === 'under_review'
  ).length;

  const lowStockCount = inventory.filter(
    (i) => i.quantityInStock <= i.minimumStockLevel
  ).length;

  const pendingPayments = payments.filter((p) => p.status === 'pending_verification').length;

  // Navigation items by role
  const isStudent = currentUser.role === 'student';
  const isTrainer = currentUser.role === 'trainer';
  const isAccountant = currentUser.role === 'accountant';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'admin', 'trainer', 'accountant'],
      badge: null
    },
    {
      id: 'student_portal',
      label: isStudent ? 'My Candidate Portal' : 'Student Portal View',
      icon: UserCircle,
      roles: ['super_admin', 'admin', 'student'],
      badge: isStudent ? 'Active' : null
    },
    {
      id: 'candidates',
      label: 'Admissions & Candidates',
      icon: Users,
      roles: ['super_admin', 'admin'],
      badge: pendingApplications > 0 ? pendingApplications : null,
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'courses',
      label: 'Courses & Cohorts',
      icon: GraduationCap,
      roles: ['super_admin', 'admin', 'trainer'],
      badge: null
    },
    {
      id: 'attendance',
      label: 'Attendance Register',
      icon: ClipboardCheck,
      roles: ['super_admin', 'admin', 'trainer'],
      badge: null
    },
    {
      id: 'grading',
      label: 'Grades & Assessments',
      icon: BookOpenCheck,
      roles: ['super_admin', 'admin', 'trainer'],
      badge: null
    },
    {
      id: 'certificates',
      label: 'Certificate Center',
      icon: Award,
      roles: ['super_admin', 'admin'],
      badge: null
    },
    {
      id: 'financials',
      label: 'Payments & Receipts',
      icon: CreditCard,
      roles: ['super_admin', 'admin', 'accountant'],
      badge: pendingPayments > 0 ? pendingPayments : null,
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'accounting',
      label: 'Accounting & Expenses',
      icon: DollarSign,
      roles: ['super_admin', 'admin', 'accountant'],
      badge: null
    },
    {
      id: 'inventory',
      label: 'Salon & Training Inventory',
      icon: PackageCheck,
      roles: ['super_admin', 'admin', 'accountant', 'trainer'],
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
      badgeColor: 'bg-red-500'
    },
    {
      id: 'communications',
      label: 'Email & WhatsApp Hub',
      icon: MessageSquareShare,
      roles: ['super_admin', 'admin'],
      badge: null
    },
    {
      id: 'audit_logs',
      label: 'System Audit Logs',
      icon: History,
      roles: ['super_admin'],
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings & Database',
      icon: Settings,
      roles: ['super_admin', 'admin'],
      badge: null
    },
    {
      id: 'gas_hub',
      label: 'GAS Deployment Code',
      icon: Code2,
      roles: ['super_admin', 'admin', 'trainer', 'accountant', 'student'],
      badge: 'Code.gs'
    }
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-stone-950/70 z-40 md:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-18 left-0 z-40 w-64 h-[calc(100vh-4.5rem)] bg-stone-900 border-r border-stone-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-1 overflow-y-auto flex-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-stone-400">
            {isStudent ? 'Candidate Space' : 'Academy Management'}
          </div>

          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-rose-950/40 font-semibold'
                    : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-100' : 'text-stone-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      item.badgeColor
                        ? `${item.badgeColor} text-white`
                        : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-stone-800 text-amber-300 border border-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Institution Info footer */}
        <div className="p-4 border-t border-stone-800/80 bg-stone-950/60">
          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>24 Google Sheets DB</span>
            </span>
            <span className="text-[10px] text-stone-500 font-mono">v1.0-GAS</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-1 truncate">
            Cohort: Jan 15 – Feb 11, 2027
          </div>
        </div>
      </aside>
    </>
  );
};
