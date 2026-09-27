import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { PinLockModal } from './components/PinLockModal';
import { QuickActionModal } from './components/QuickActionModal';

import { DashboardScreen } from './screens/DashboardScreen';
import { DailyWorkScreen } from './screens/DailyWorkScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { WorkersScreen } from './screens/WorkersScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { ContractsScreen } from './screens/ContractsScreen';
import { FinanceScreen } from './screens/FinanceScreen';
import { DefectsScreen } from './screens/DefectsScreen';
import { HandoversScreen } from './screens/HandoversScreen';
import { MediaScreen } from './screens/MediaScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { AndroidStudioScreen } from './screens/AndroidStudioScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainLayout: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'daily_work':
        return <DailyWorkScreen />;
      case 'projects':
        return <ProjectsScreen />;
      case 'workers':
        return <WorkersScreen />;
      case 'clients':
        return <ClientsScreen />;
      case 'contracts':
        return <ContractsScreen />;
      case 'invoices':
      case 'finance':
        return <FinanceScreen />;
      case 'defects':
        return <DefectsScreen />;
      case 'handovers':
        return <HandoversScreen />;
      case 'media':
        return <MediaScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'android_code':
        return <AndroidStudioScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Screen Content */}
      <main className="flex-1 w-full">
        {renderActiveScreen()}
      </main>

      {/* Bottom Nav / Desktop Secondary Bar */}
      <BottomNav />

      {/* Floating Modals & Overlays */}
      <PinLockModal />
      <QuickActionModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-500/50 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur animate-in fade-in duration-150 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
