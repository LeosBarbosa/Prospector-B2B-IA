import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { GoalMetric, GoalTimeframe } from '../types';
import { TrophyIcon, CancelIcon, CheckIcon } from './icons/Icons';

const GoalCreatorModal: React.FC = () => {
    const { isGoalModalOpen, setIsGoalModalOpen, addGoal } = useApp();
    const [name, setName] = useState('');
    const [timeframe, setTimeframe] = useState<GoalTimeframe>(GoalTimeframe.WEEKLY);
    const [metric, setMetric] = useState<GoalMetric>(GoalMetric.MEETINGS_SET);
    const [targetValue, setTargetValue] = useState<number>(10);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name.trim() || targetValue <= 0) {
            setError('Nome da meta e valor alvo (maior que 0) são obrigatórios.');
            return;
        }
        setError('');
        addGoal({
            name,
            assignee: 'Leonardo Barbosa (Você)',
            timeframe,
            metric,
            targetValue,
        });
        // Reset form
        setName('');
        setTargetValue(10);
    };

    if (!isGoalModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700 flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold text-sky-400 flex items-center gap-2">
                        <TrophyIcon className="w-6 h-6" />
                        Criar Nova Meta
                    </h2>
                    <button onClick={() => setIsGoalModalOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </header>
                <main className="p-6 space-y-4">
                    {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-2 rounded-md text-sm">{error}</div>}
                    <div className="space-y-2">
                        <label htmlFor="goal-name" className="block text-sm font-medium text-gray-300">Nome da meta</label>
                        <input
                            id="goal-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Envio de e-mails Q4"
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="goal-assignee" className="block text-sm font-medium text-gray-300">Atribuir a</label>
                            <input id="goal-assignee" type="text" readOnly value="Leonardo Barbosa (Você)" className="w-full bg-gray-900 border-2 border-gray-700 rounded-md py-2 px-3 text-gray-400 cursor-not-allowed" />
                        </div>
                         <div className="space-y-2">
                            <label htmlFor="goal-timeframe" className="block text-sm font-medium text-gray-300">Prazo</label>
                            <select
                                id="goal-timeframe"
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value as GoalTimeframe)}
                                className="w-full bg-gray-700 border-2 border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                {Object.values(GoalTimeframe).map(tf => <option key={tf} value={tf}>{tf}</option>)}
                            </select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="goal-metric" className="block text-sm font-medium text-gray-300">Métrica</label>
                        <select
                            id="goal-metric"
                            value={metric}
                            onChange={(e) => setMetric(e.target.value as GoalMetric)}
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            {Object.values(GoalMetric).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="goal-target" className="block text-sm font-medium text-gray-300">Valor Alvo</label>
                        <input
                            id="goal-target"
                            type="number"
                            value={targetValue}
                            onChange={(e) => setTargetValue(Number(e.target.value))}
                            min="1"
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                </main>
                <footer className="flex justify-end items-center gap-3 p-4 border-t border-gray-700">
                    <button onClick={() => setIsGoalModalOpen(false)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                        <CancelIcon className="w-4 h-4" /> Cancelar
                    </button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 font-semibold transition-colors">
                        <CheckIcon className="w-4 h-4" /> Salvar Meta
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default GoalCreatorModal;
