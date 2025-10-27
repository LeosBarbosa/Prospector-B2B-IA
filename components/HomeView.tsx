import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AppView } from '../types';
// FIX: Removed unused and non-existent `ArrowRightIcon` import as it was causing a compilation error.
import { SearchIcon, WorkflowIcon } from './icons/Icons';

const HomeView: React.FC = () => {
    const { setActiveView } = useApp();

    return (
        <div className="animate-fade-in w-full max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Bem-vindo, Leonardo 👋</h1>
                <p className="text-gray-400 mt-1">Aqui estão os próximos passos recomendados para você.</p>
            </header>

            <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold text-sky-400 mb-4">Configuração do Espaço de Trabalho</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-700 p-4 rounded-md">
                        <div className="flex items-center gap-4">
                            <SearchIcon className="h-6 w-6 text-gray-400" />
                            <div>
                                <h3 className="font-semibold text-white">Inicie uma pesquisa guiada de leads</h3>
                                <p className="text-sm text-gray-400">Encontre seus próximos clientes usando nossos filtros poderosos.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setActiveView(AppView.SEARCH)}
                            className="bg-sky-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-sky-500 transition-colors"
                        >
                            Começar
                        </button>
                    </div>
                    <div className="flex justify-between items-center bg-gray-700 p-4 rounded-md">
                        <div className="flex items-center gap-4">
                            <WorkflowIcon className="h-6 w-6 text-gray-400" />
                            <div>
                                <h3 className="font-semibold text-white">Mantenha seus negócios em movimento</h3>
                                <p className="text-sm text-gray-400">Crie cadências automatizadas para engajar seus prospects.</p>
                            </div>
                        </div>
                         <button 
                            onClick={() => setActiveView(AppView.ENGAGE)}
                            className="bg-gray-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
                        >
                            Começar
                        </button>
                    </div>
                </div>
            </section>
            
            <section className="mt-8">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Explore peças e tutoriais prontos para ganhar impulso</h2>
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl cursor-pointer hover:bg-gray-700/50">
                     <h3 className="font-semibold text-white">Modelos de Prospecção para GTM</h3>
                     <p className="text-sm text-gray-400 mt-1">Aprenda com os melhores modelos para acelerar sua estratégia de go-to-market.</p>
                </div>
            </section>
        </div>
    );
};

export default HomeView;