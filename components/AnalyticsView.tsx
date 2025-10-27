import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { ChartBarIcon, PlusIcon, TrophyIcon } from './icons/Icons';
import { Task, TaskStatus, TaskType, GoalMetric } from '../types';

const AnalyticsView: React.FC = () => {
    const { setIsGoalModalOpen, goals, cadences } = useApp();

    const emailStats = useMemo(() => {
        const allEmailTasks = cadences.flatMap(c => 
            Object.values(c.tasksByProspectId).flat()
        ).filter(t => t.type === TaskType.EMAIL);

        const sent = allEmailTasks.length;
        // Simulação: "Abertos" são 80% dos completos, "Respondidos" são 30% dos abertos
        const completed = allEmailTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
        const opened = Math.floor(completed * 0.8);
        const replied = Math.floor(opened * 0.3);

        return { sent, opened, replied, clicked: Math.floor(opened * 0.5) };

    }, [cadences]);

    const getGoalProgress = (goal: typeof goals[0]) => {
        let currentValue = 0;
        const allTasks = cadences.flatMap(c => Object.values(c.tasksByProspectId).flat());
        
        switch (goal.metric) {
            case GoalMetric.EMAILS_SENT:
                currentValue = allTasks.filter(t => t.type === TaskType.EMAIL && t.status === TaskStatus.COMPLETED).length;
                break;
            // Adicionar lógica para outras métricas aqui
            case GoalMetric.CALLS_CONNECTED:
            case GoalMetric.MEETINGS_SET:
            case GoalMetric.PROSPECTS_ADDED:
                 // Simulação simples
                currentValue = allTasks.filter(t => t.status === TaskStatus.COMPLETED).length / 2;
                break;
        }
        
        const progress = goal.targetValue > 0 ? (currentValue / goal.targetValue) * 100 : 0;
        return { currentValue: Math.floor(currentValue), progress: Math.min(progress, 100) };
    };


    return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Análise e Performance</h1>
                    <p className="text-gray-400 mt-1">Métricas e relatórios para otimizar sua estratégia de vendas.</p>
                </div>
                <button 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 text-white font-bold hover:bg-sky-500 transition-colors"
                >
                    <PlusIcon />
                    Criar meta
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-sky-400 mb-4">Estatísticas de E-mail (Total)</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div><p className="text-3xl font-bold">{emailStats.sent}</p><p className="text-sm text-gray-400">Enviados</p></div>
                            <div><p className="text-3xl font-bold">{emailStats.opened}</p><p className="text-sm text-gray-400">Abertos (Est.)</p></div>
                            <div><p className="text-3xl font-bold">{emailStats.clicked}</p><p className="text-sm text-gray-400">Clicados (Est.)</p></div>
                            <div><p className="text-3xl font-bold">{emailStats.replied}</p><p className="text-sm text-gray-400">Respondidos (Est.)</p></div>
                        </div>
                    </div>
                     <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-sky-400 mb-4">Funil de E-mail</h2>
                        {emailStats.sent > 0 ? (
                             <div className="flex items-end justify-center h-48 space-x-4">
                                <div className="flex flex-col items-center w-20 text-center"><div className="w-12 bg-sky-500" style={{height: '100%'}}></div><p className="text-xs mt-2 text-gray-400">Enviados ({emailStats.sent})</p></div>
                                <div className="flex flex-col items-center w-20 text-center"><div className="w-12 bg-sky-600" style={{height: `${(emailStats.opened/emailStats.sent)*100}%`}}></div><p className="text-xs mt-2 text-gray-400">Abertos ({emailStats.opened})</p></div>
                                <div className="flex flex-col items-center w-20 text-center"><div className="w-12 bg-teal-500" style={{height: `${(emailStats.replied/emailStats.sent)*100}%`}}></div><p className="text-xs mt-2 text-gray-400">Respondidos ({emailStats.replied})</p></div>
                            </div>
                        ) : (
                            <p className="text-center text-sm text-gray-500 mt-4 pt-16">Nenhum dado disponível ainda.</p>
                        )}
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-sky-400 mb-4">Metas Recentes</h2>
                     <div className="space-y-4">
                        {goals.length > 0 ? goals.map(goal => {
                            const { currentValue, progress } = getGoalProgress(goal);
                            return (
                             <div key={goal.id} className="bg-gray-700 p-4 rounded-md">
                                <p className="font-semibold text-white">{goal.name}</p>
                                <p className="text-sm text-gray-400">{goal.metric} - {goal.timeframe}</p>
                                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="text-right text-xs text-gray-400 mt-1">{currentValue} de {goal.targetValue}</p>
                            </div>
                            )
                        }) : (
                            <div className="text-center text-gray-500 py-10">
                                <TrophyIcon className="h-10 w-10 mx-auto mb-2" />
                                <p>Nenhuma meta criada ainda.</p>
                                <p className="text-xs">Use o botão "Criar meta" para começar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;