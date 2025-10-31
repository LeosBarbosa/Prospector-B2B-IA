import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext.tsx';
import TopHeader from './components/TopHeader.tsx';
import SideNav from './components/SideNav.tsx';
import AppsView from './components/AppsView.tsx';
import ProspectingView from './components/ProspectingView.tsx';
import PipelinesView from './components/PipelinesView.tsx';
import WorkflowsView from './components/WorkflowsView.tsx';
import SequenceBuilderView from './components/SequenceBuilderView.tsx';

const LandingPagesView: React.FC = () => <div className="p-6 text-center"><h1>Landing Pages</h1><p>This feature is under construction.</p></div>;
const AgentsView: React.FC = () => <div className="p-6 text-center"><h1>Agents</h1><p>This feature is under construction.</p></div>;
const SearchView: React.FC = () => <div className="p-6 text-center"><h1>Search</h1><p>This feature is under construction.</p></div>;

const AppContent: React.FC = () => {
    const { activeView } = useApp();

    const renderView = () => {
        switch (activeView) {
            case 'apps':
                return <AppsView />;
            case 'prospecting':
                return <ProspectingView />;
            case 'pipelines':
                return <PipelinesView />;
            case 'automation':
                return <WorkflowsView />;
            case 'sequence-builder':
                return <SequenceBuilderView />;
            case 'landing-pages':
                return <LandingPagesView />;
            case 'agents':
                return <AgentsView />;
            case 'search':
                return <SearchView />;
            default:
                return <AppsView />;
        }
    };

    return (
        <main className="flex-grow overflow-y-auto bg-background-light">
           {renderView()}
        </main>
    );
};

const App: React.FC = () => {
  return (
    <AppProvider>
        <div className="flex h-screen bg-background-light font-sans text-text-dark">
            <SideNav />
            <div className="flex flex-col flex-grow overflow-hidden">
                <TopHeader />
                <AppContent />
            </div>
        </div>
    </AppProvider>
  );
};

export default App;