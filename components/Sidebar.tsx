import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AppView } from '../types';
import { HomeIcon, SearchIcon, ListBulletIcon, WorkflowIcon, ChartBarIcon, ChatIcon, CogIcon, LogoIcon } from './icons/Icons';

const Sidebar: React.FC = () => {
    const { activeView, setActiveView } = useApp();

    const navItems = [
        { view: AppView.HOME, label: 'Home', icon: <HomeIcon /> },
        { view: AppView.SEARCH, label: 'Pesquisa', icon: <SearchIcon /> },
        { view: AppView.LISTS, label: 'Listas', icon: <ListBulletIcon /> },
        { view: AppView.ENGAGE, label: 'Engajamento', icon: <WorkflowIcon /> },
        { view: AppView.ANALYTICS, label: 'Análise', icon: <ChartBarIcon /> },
        { view: AppView.CHAT, label: 'Assistente', icon: <ChatIcon /> },
        { view: AppView.SETTINGS, label: 'Configurações', icon: <CogIcon /> },
    ];

    const NavButton: React.FC<{ view: AppView; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => {
        const isActive = activeView === view;
        return (
            <div className="relative group">
                <button
                    onClick={() => setActiveView(view)}
                    className={`w-full flex justify-center items-center p-3 rounded-lg transition-colors duration-200 relative ${
                        isActive ? 'bg-sky-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-sky-400 rounded-r-full"></div>}
                    {icon}
                </button>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {label}
                </div>
            </div>
        );
    };

    return (
        <aside className="bg-gray-800 w-20 flex flex-col items-center py-4 space-y-4 border-r border-gray-700">
            <div className="mb-4">
                <LogoIcon className="text-sky-500 w-10 h-10" />
            </div>
            <nav className="w-full flex flex-col items-center space-y-2 px-2">
                {navItems.map(item => (
                    <NavButton key={item.view} {...item} />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;