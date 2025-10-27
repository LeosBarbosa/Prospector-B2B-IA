import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import SuspectsList from './SuspectsList';
import ProspectsList from './ProspectsList';
import GroupAnalysisView from './GroupAnalysisView';
import { ArrowUpTrayIcon, ArrowDownTrayIcon, TableCellsIcon, ExportIcon, ListBulletIcon, NetworkIcon } from './icons/Icons';

type SortOrder = 'newest' | 'oldest' | 'alphaAZ' | 'alphaZA' | 'probability';
type ActiveTab = 'suspects' | 'prospects';
type ProspectsViewMode = 'list' | 'graph';

const ListsView: React.FC = () => {
    const { 
        suspects, 
        savedProspects,
        handleImportClick,
        handleExport,
        handleExportSheet,
        sheetFileInputRef,
        handleSheetFileChange,
        fileInputRef,
        handleFileChange
    } = useApp();

    const [activeTab, setActiveTab] = useState<ActiveTab>('suspects');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('probability');
    const [selectedSegment, setSelectedSegment] = useState('');
    const [prospectsViewMode, setProspectsViewMode] = useState<ProspectsViewMode>('list');
    
    useEffect(() => {
        if (activeTab === 'suspects') {
            setProspectsViewMode('list');
        }
    }, [activeTab]);

    const uniqueSegments = useMemo(() => {
        const currentList = activeTab === 'suspects' ? suspects : savedProspects;
        const segments = currentList
          .map(p => p.segment)
          .filter((s): s is string => !!s);
        return [...new Set(segments)].sort();
    }, [suspects, savedProspects, activeTab]);

    const TabButton: React.FC<{ tab: ActiveTab; label: string; count: number }> = ({ tab, label, count }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
                activeTab === tab 
                ? 'bg-gray-800 text-white border-b-2 border-sky-500' 
                : 'text-gray-400 hover:text-white'
            }`}
        >
            {label} <span className="text-xs bg-gray-600 px-2 py-0.5 rounded-full">{count}</span>
        </button>
    );

    const ViewModeButton: React.FC<{ mode: ProspectsViewMode, label: string, icon: React.ReactNode}> = ({ mode, label, icon }) => {
        const isActive = prospectsViewMode === mode;
        return (
            <button
                onClick={() => setProspectsViewMode(mode)}
                className={`px-3 py-1.5 flex items-center gap-2 text-xs rounded-md transition-colors ${
                    isActive ? 'bg-sky-600 text-white' : 'hover:bg-gray-600'
                }`}
                title={label}
            >
                {icon}
            </button>
        )
    };

    return (
        <div className="animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-sky-400">Minhas Listas</h1>
                <div className="flex flex-wrap items-center gap-2">
                     <button onClick={handleImportClick} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600" title="Importar Sessão (.json)">
                        <ArrowUpTrayIcon />
                    </button>
                    <button onClick={() => sheetFileInputRef.current?.click()} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600" title="Importar Planilha (.xlsx, .csv)">
                        <TableCellsIcon />
                    </button>
                    <button onClick={handleExportSheet} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600" title="Exportar para Planilha (.xlsx)">
                        <ArrowDownTrayIcon />
                    </button>
                   <button onClick={handleExport} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600" title="Exportar Sessão (.json)">
                      <ExportIcon />
                   </button>
                   <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={sheetFileInputRef}
                    onChange={handleSheetFileChange}
                    accept=".xlsx, .csv"
                    className="hidden"
                  />
                </div>
            </header>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full mx-auto">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <div className="flex-grow">
                         {(activeTab === 'suspects' || (activeTab === 'prospects' && prospectsViewMode === 'list')) && (
                             <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nome, CNPJ..."
                                className="w-full max-w-sm bg-gray-700 border-2 border-gray-600 rounded-md py-2 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                            />
                         )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        {(uniqueSegments.length > 0 && (activeTab === 'suspects' || (activeTab === 'prospects' && prospectsViewMode === 'list'))) && (
                            <select 
                                value={selectedSegment}
                                onChange={e => setSelectedSegment(e.target.value)}
                                className="w-full sm:w-48 bg-gray-700 border-2 border-gray-600 rounded-md py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">Todos os Segmentos</option>
                                {uniqueSegments.map(segment => <option key={segment} value={segment}>{segment}</option>)}
                            </select>
                        )}
                         {activeTab === 'prospects' && prospectsViewMode === 'list' && (
                             <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                                className="w-full sm:w-48 bg-gray-700 border-2 border-gray-600 rounded-md py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="probability">Probabilidade (Alta-Baixa)</option>
                                <option value="alphaAZ">Alfabética (A-Z)</option>
                                <option value="alphaZA">Alfabética (Z-A)</option>
                                <option value="newest">Mais recentes</option>
                                <option value="oldest">Mais antigos</option>
                            </select>
                         )}
                          {activeTab === 'prospects' && (
                            <div className="flex items-center bg-gray-700 rounded-md p-1 self-end">
                               <ViewModeButton mode="list" label="Visualização em Lista" icon={<ListBulletIcon className="w-5 h-5"/>} />
                               <ViewModeButton mode="graph" label="Análise de Grupo" icon={<NetworkIcon className="w-5 h-5" />} />
                            </div>
                          )}
                    </div>
                </div>

                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-4">
                        <TabButton tab="suspects" label="Suspects" count={suspects.length} />
                        <TabButton tab="prospects" label="Prospects" count={savedProspects.length} />
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === 'suspects' ? (
                        <SuspectsList searchTerm={searchTerm} selectedSegment={selectedSegment} />
                    ) : (
                        prospectsViewMode === 'list' ? (
                           <ProspectsList searchTerm={searchTerm} sortOrder={sortOrder} selectedSegment={selectedSegment} />
                        ) : (
                           <GroupAnalysisView />
                        )
                    )}
                </div>

            </div>
        </div>
    );
};

export default ListsView;