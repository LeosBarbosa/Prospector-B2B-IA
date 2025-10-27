import React, { useState, useMemo, useEffect } from 'react';
import { SheetRow } from '../types';
import { useApp } from '../contexts/AppContext';
import { LoadingSpinner } from './icons/Icons';

const SheetPreviewModal: React.FC = () => {
    const { 
        isSheetPreviewOpen, 
        sheetPreviewData, 
        closeSheetPreview,
        processSheetSelection
    } = useApp();
    
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Reset selection when data changes
        setSelectedIds(new Set());
    }, [sheetPreviewData]);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return sheetPreviewData;
        const lowercasedFilter = searchTerm.toLowerCase();
        return sheetPreviewData.filter(row => 
            Object.values(row.data).some(value => 
                String(value).toLowerCase().includes(lowercasedFilter)
            )
        );
    }, [sheetPreviewData, searchTerm]);

    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedIds.size === filteredData.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredData.map(row => row.id)));
        }
    };

    const handleSubmit = () => {
        processSheetSelection(Array.from(selectedIds));
    };
    
    if (!isSheetPreviewOpen) return null;

    const headers = sheetPreviewData.length > 0 ? Object.keys(sheetPreviewData[0].data) : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl border border-gray-700 flex flex-col max-h-[90vh]">
                <header className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-700 gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-sky-400">Pré-visualização da Planilha</h2>
                        <p className="text-sm text-gray-400">Revise os dados, selecione os registros para analisar e clique em 'Analisar'.</p>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filtrar registros..."
                        className="bg-gray-700 border-2 border-gray-600 rounded-md py-2 px-3 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </header>

                <main className="p-4 flex-grow overflow-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                            <tr>
                                <th scope="col" className="p-3">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-sky-600 bg-gray-600 border-gray-500 rounded focus:ring-sky-500"
                                        checked={filteredData.length > 0 && selectedIds.size === filteredData.length}
                                        onChange={handleSelectAll}
                                        aria-label="Selecionar todos"
                                    />
                                </th>
                                {headers.map(header => (
                                    <th key={header} scope="col" className="px-4 py-3">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(row => (
                                <tr key={row.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="w-4 p-3">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-sky-600 bg-gray-600 border-gray-500 rounded focus:ring-sky-500"
                                            checked={selectedIds.has(row.id)}
                                            onChange={() => handleToggleSelect(row.id)}
                                        />
                                    </td>
                                    {headers.map(header => (
                                        <td key={`${row.id}-${header}`} className="px-4 py-3">{row.data[header] || '-'}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredData.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                          <p>Nenhum registro encontrado com o filtro atual.</p>
                        </div>
                      )}
                </main>

                <footer className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-700 shrink-0">
                    <p className="text-sm text-gray-400">{selectedIds.size} de {filteredData.length} selecionado(s).</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={closeSheetPreview}
                            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={selectedIds.size === 0}
                            className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed font-semibold"
                        >
                            Analisar {selectedIds.size} Selecionado(s)
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SheetPreviewModal;