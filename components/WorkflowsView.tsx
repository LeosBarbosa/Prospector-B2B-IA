import React from 'react';
// FIX: Add file extension to fix module resolution error.
import { useApp } from '../contexts/AppContext.tsx';

// FIX: Rename component to match filename.
const WorkflowsView: React.FC = () => {
    const { setActiveView } = useApp();
    
    // Mock data for sequences
    const sequences = [
        { id: 1, name: 'Nova Sequência 25/10/25', proprietor: 'Leonardo Soares B...', contacts: '-', status: 'Incompleto' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Sequências</h1>
                <div className="flex gap-4">
                    <button className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700">
                        Sincronizar com CRM
                    </button>
                    <button onClick={() => setActiveView('sequence-builder')} className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700">
                        + Nova sequência
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 text-gray-500">
                        <tr>
                            <th className="py-2">Sequência</th>
                            <th className="py-2">Proprietário</th>
                            <th className="py-2">Contatos</th>
                            <th className="py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sequences.map(seq => (
                            <tr key={seq.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 font-semibold text-purple-600 cursor-pointer hover:underline">{seq.name}</td>
                                <td className="py-3 text-gray-600">{seq.proprietor}</td>
                                <td className="py-3 text-gray-600">{seq.contacts}</td>
                                <td className="py-3"><span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full">{seq.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// FIX: Rename component export to match filename.
export default WorkflowsView;
