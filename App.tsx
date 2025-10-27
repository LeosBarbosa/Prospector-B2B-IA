import React from 'react';
import ProspectingTool from './components/ProspectingTool';
import ChatBot from './components/ChatBot';
import CadenceTool from './components/CadenceTool';
import ListsView from './components/ListsView';
import HomeView from './components/HomeView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import Sidebar from './components/Sidebar';
import SheetPreviewModal from './components/SheetPreviewModal';
import GoalCreatorModal from './components/GoalCreatorModal';
import { WorkflowTemplateModal, WorkflowPersonalizationModal } from './components/WorkflowModals';
import { AppView } from './types';
import { 
    LogoIcon, 
    LoadingSpinner
} from './components/icons/Icons';
import { useApp } from './contexts/AppContext';

const App: React.FC = () => {
  const { 
    activeView, 
    notifications, 
    confirmation, 
    setConfirmation,
    isLoadingState,
    isImporting,
    importProgress,
    isSheetPreviewOpen,
    isGoalModalOpen,
    isTemplateModalOpen,
    isPersonalizationModalOpen
  } = useApp();

  const renderView = () => {
    switch (activeView) {
      case AppView.HOME: return <HomeView />;
      case AppView.SEARCH: return <ProspectingTool />;
      case AppView.LISTS: return <ListsView />;
      case AppView.ENGAGE: return <CadenceTool />;
      case AppView.ANALYTICS: return <AnalyticsView />;
      case AppView.CHAT: return <ChatBot />;
      case AppView.SETTINGS: return <SettingsView />;
      default: return <HomeView />;
    }
  };
  
  const notificationStyles = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-sky-600 border-sky-500',
  };

  if (isLoadingState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
        <LogoIcon className="text-sky-500 w-16 h-16 mb-4" />
        <div className="flex items-center text-xl">
          <LoadingSpinner className="animate-spin mr-3 h-6 w-6 text-white" />
          Carregando sua sessão...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0d1117] text-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {isSheetPreviewOpen && <SheetPreviewModal />}
        {isGoalModalOpen && <GoalCreatorModal />}
        {isTemplateModalOpen && <WorkflowTemplateModal />}
        {isPersonalizationModalOpen && <WorkflowPersonalizationModal />}

        {isImporting && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-[100]">
            <LoadingSpinner className="h-12 w-12 text-sky-500" />
            <p className="text-xl mt-4">Analisando planilha...</p>
            <p className="text-gray-400">{importProgress}</p>
          </div>
        )}
        <div className="fixed top-5 right-5 z-50 w-full max-w-sm space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              style={{ animation: 'fade-in-down 0.5s' }}
              className={`p-4 border rounded-lg shadow-lg text-white ${notificationStyles[n.type]}`}
            >
              {n.message}
            </div>
          ))}
        </div>

        {confirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-2xl border border-gray-700" style={{ animation: 'fade-in-down 0.3s' }}>
              <h3 className="text-lg font-bold mb-4 text-gray-100">{confirmation.title}</h3>
              <p className="text-gray-300 mb-6">{confirmation.message}</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmation(null)} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancelar</button>
                <button onClick={confirmation.onConfirm} className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 transition-colors">Confirmar</button>
              </div>
            </div>
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;