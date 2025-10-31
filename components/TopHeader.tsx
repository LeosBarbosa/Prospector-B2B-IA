import React from 'react';
import { useApp } from '../contexts/AppContext.tsx';
import { ActiveView } from '../types.ts';
import { AutomationIcon, SearchIcon, AgentsIcon, LandingPagesIcon, PipelinesIcon, ProspectingIcon, AppsIcon, BellIcon, UserCircleIcon } from './icons/Icons.tsx';

const NavItem: React.FC<{
  view: ActiveView;
  label: string;
  icon?: React.ReactNode;
}> = ({ view, label, icon }) => {
  const { activeView, setActiveView } = useApp();
  const isActive = activeView === view;

  return (
    <button
      onClick={() => setActiveView(view)}
      className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md
        ${isActive ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}
      `}
    >
      {icon}
      <span>{label}</span>
      {isActive && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-white rounded-t-full"></div>}
    </button>
  );
};

const TopHeader: React.FC = () => {
  return (
    <header className="bg-background-dark text-white flex items-center justify-between px-4 shadow-md h-16 relative z-20 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-color-secondary rounded-md flex items-center justify-center font-bold text-xl text-white">L</div>
            <span className="font-bold text-lg">Leads2b</span>
        </div>
        <nav className="flex items-center gap-2">
            <NavItem view="apps" label="Apps" icon={<AppsIcon className="w-4 h-4" />} />
            <NavItem view="prospecting" label="Prospecção" icon={<ProspectingIcon className="w-4 h-4" />} />
            <NavItem view="pipelines" label="Pipelines" icon={<PipelinesIcon className="w-4 h-4" />} />
            <NavItem view="landing-pages" label="Landing Pages" icon={<LandingPagesIcon className="w-4 h-4" />} />
            <NavItem view="automation" label="Automação" icon={<AutomationIcon className="w-4 h-4" />} />
            <NavItem view="agents" label="Agentes" icon={<AgentsIcon className="w-4 h-4" />} />
            <NavItem view="search" label="Buscar" icon={<SearchIcon className="w-4 h-4" />} />
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-300 hover:text-white">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <UserCircleIcon className="w-8 h-8 text-gray-300"/>
      </div>
    </header>
  );
};

export default TopHeader;