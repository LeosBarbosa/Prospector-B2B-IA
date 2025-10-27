import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { CheckIcon, EmailIcon, LinkedInIcon, PhoneIcon } from './icons/Icons';

export const WorkflowTemplateModal: React.FC = () => {
    const { isTemplateModalOpen, selectedTemplate, closeWorkflowModals, handleContinueToPersonalization } = useApp();
    
    if (!isTemplateModalOpen || !selectedTemplate) return null;

    const sequenceDetails = [
        { type: 'EMAIL', day: 1, description: 'E-mail automático' },
        { type: 'EMAIL', day: 7, description: 'E-mail automático de acompanhamento' },
        { type: 'LINKEDIN', day: 12, description: 'LinkedIn - enviar solicitação de conexão' },
        { type: 'CALL', day: 15, description: 'Tarefa - Ligar para o prospect' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'EMAIL': return <EmailIcon className="w-4 h-4 text-sky-400" />;
            case 'LINKEDIN': return <LinkedInIcon className="w-4 h-4 text-blue-400" />;
            case 'CALL': return <PhoneIcon className="w-4 h-4 text-green-400" />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700 flex flex-col max-h-[90vh]">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold text-sky-400">{selectedTemplate.name}</h2>
                    <button onClick={closeWorkflowModals} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </header>

                <main className="p-6 flex-grow overflow-y-auto space-y-6">
                    <div>
                        <h3 className="font-semibold text-gray-300 mb-2">Resumo do Modelo</h3>
                        <p className="text-sm text-gray-400">{selectedTemplate.description}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-300 mb-2">Detalhes da Sequência</h3>
                        <div className="space-y-3">
                            {sequenceDetails.map((step, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700">
                                        {getIcon(step.type)}
                                    </div>
                                    <span className="font-semibold text-white">{step.description}</span>
                                    <span className="text-gray-500">| Dia {step.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <footer className="flex justify-end items-center gap-3 p-4 border-t border-gray-700 shrink-0">
                    <button onClick={closeWorkflowModals} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancelar</button>
                    <button onClick={handleContinueToPersonalization} className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 font-semibold transition-colors">
                        Comece
                    </button>
                </footer>
            </div>
        </div>
    );
};

export const WorkflowPersonalizationModal: React.FC = () => {
    const { isPersonalizationModalOpen, closeWorkflowModals, handleCreateWorkflow } = useApp();
    const [painPoints, setPainPoints] = useState('');
    const [valueProp, setValueProp] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!painPoints.trim() || !valueProp.trim()) {
            setError('Ambos os campos são obrigatórios para a personalização com IA.');
            return;
        }
        setError('');
        handleCreateWorkflow({ painPoints, valueProp });
        setPainPoints('');
        setValueProp('');
    };

    if (!isPersonalizationModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700 flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold text-sky-400">Personalize o Modelo com IA</h2>
                    <button onClick={closeWorkflowModals} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </header>
                <main className="p-6 space-y-4">
                    {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-2 rounded-md text-sm">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Quais são os pontos fracos de seus clientes?</label>
                        <textarea
                            value={painPoints}
                            onChange={e => setPainPoints(e.target.value)}
                            placeholder="Ex: Muito trabalho manual para encontrar prospects e criar abordagens personalizadas."
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            rows={4}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Qual é a proposta de valor do seu produto?</label>
                        <textarea
                            value={valueProp}
                            onChange={e => setValueProp(e.target.value)}
                            placeholder="Ex: Automação de funil de vendas de ponta a ponta."
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            rows={4}
                        />
                    </div>
                </main>
                 <footer className="flex justify-end items-center gap-3 p-4 border-t border-gray-700 shrink-0">
                    <button onClick={closeWorkflowModals} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 font-semibold transition-colors">
                        <CheckIcon className="w-4 h-4"/> Salvar e continuar
                    </button>
                </footer>
            </div>
        </div>
    );
}
