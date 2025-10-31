import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext.tsx';
import { ActiveView } from '../types.ts';
import { AppsIcon, ProspectingIcon, PipelinesIcon, AutomationIcon, AgentsIcon, PinIcon, ChevronDoubleLeftIcon } from './icons/Icons.tsx';

interface NavItemProps {
    view: ActiveView;
    label: string;
    icon: React.ReactNode;
    isExpanded: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, isExpanded }) => {
    const { activeView, setActiveView } = useApp();
    const isActive = activeView === view;

    return (
        <button
            onClick={() => setActiveView(view)}
            title={isExpanded ? '' : label}
            className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 ${
                isActive 
                ? 'bg-color-primary/10 text-color-primary' 
                : 'text-text-muted hover:bg-gray-200'
            }`}
        >
            {icon}
            {isExpanded && <span className="ml-4 font-semibold text-sm">{label}</span>}
        </button>
    );
};

const SideNav: React.FC = () => {
    const { isNavPinned, setIsNavPinned } = useApp();
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = isNavPinned || isHovered;

    return (
        <aside
            className={`relative bg-white border-r border-border-color flex flex-col shrink-0 transition-all duration-300 z-30 ${isExpanded ? 'w-56' : 'w-16'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-center h-16 border-b border-border-color relative">
                 {isExpanded && <span className="font-bold text-lg text-text-dark">Menu</span>}
                 <button 
                    onClick={() => setIsNavPinned(!isNavPinned)} 
                    className="absolute right-3 text-text-muted hover:text-text-dark transition-transform duration-300"
                    style={{ transform: isNavPinned ? 'rotate(0deg)' : 'rotate(0deg)'}}
                    title={isNavPinned ? 'Desafixar menu' : 'Fixar menu'}
                 >
                    {isExpanded ? <ChevronDoubleLeftIcon className={`w-5 h-5 ${isNavPinned ? 'text-color-primary' : ''}`} /> : <PinIcon className="w-5 h-5" />}
                 </button>
            </div>
            <nav className="flex-grow p-2">
                <NavItem view="apps" label="Apps" icon={<AppsIcon className="w-6 h-6" />} isExpanded={isExpanded} />
                <NavItem view="prospecting" label="Prospecção" icon={<ProspectingIcon className="w-6 h-6" />} isExpanded={isExpanded} />
                <NavItem view="pipelines" label="Pipelines" icon={<PipelinesIcon className="w-6 h-6" />} isExpanded={isExpanded} />
                <NavItem view="automation" label="Automação" icon={<AutomationIcon className="w-6 h-6" />} isExpanded={isExpanded} />
                <NavItem view="agents" label="Agentes de IA" icon={<AgentsIcon className="w-6 h-6" />} isExpanded={isExpanded} />
            </nav>
        </aside>
    );
};

export default SideNav;
