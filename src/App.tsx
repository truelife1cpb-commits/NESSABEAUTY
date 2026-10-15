import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { CandidatesView } from './components/views/CandidatesView';
import { RegistrationView } from './components/views/RegistrationView';
import { CoursesView } from './components/views/CoursesView';
import { FinancialsView } from './components/views/FinancialsView';
import { AttendanceView } from './components/views/AttendanceView';
import { GradingView } from './components/views/GradingView';
import { CertificatesView } from './components/views/CertificatesView';
import { AccountingView } from './components/views/AccountingView';
import { InventoryView } from './components/views/InventoryView';
import { CommunicationsView } from './components/views/CommunicationsView';
import { StudentPortalView } from './components/views/StudentPortalView';
import { PublicVerificationView } from './components/views/PublicVerificationView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { SettingsView } from './components/views/SettingsView';
import { GasCodeHubView } from './components/views/GasCodeHubView';

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<string>(
    currentUser.role === 'student' ? 'student_portal' : 'dashboard'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If role changes to student, default to student portal
  React.useEffect(() => {
    if (currentUser.role === 'student' && activeTab === 'dashboard') {
      setActiveTab('student_portal');
    }
  }, [currentUser.role]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'candidates':
        return <CandidatesView />;
      case 'registration':
        return <RegistrationView onSuccessNavigate={() => setActiveTab('candidates')} />;
      case 'courses':
        return <CoursesView />;
      case 'financials':
        return <FinancialsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'grading':
        return <GradingView />;
      case 'certificates':
        return <CertificatesView />;
      case 'accounting':
        return <AccountingView />;
      case 'inventory':
        return <InventoryView />;
      case 'communications':
        return <CommunicationsView />;
      case 'student_portal':
        return <StudentPortalView />;
      case 'verify':
        return <PublicVerificationView />;
      case 'audit_logs':
        return <AuditLogsView />;
      case 'settings':
        return <SettingsView />;
      case 'gas_hub':
        return <GasCodeHubView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Body with Sidebar and Main Stage */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
