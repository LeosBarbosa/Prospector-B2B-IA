import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { initialPipelineData } from '../utils/defaultSession.ts';
import { Pipeline, Stage, Deal } from '../types.ts';
import { FilterIcon, PlusIcon } from './icons/Icons.tsx';

const DealCard: React.FC<{ deal: Deal, index: number }> = ({ deal, index }) => {
    return (
        <Draggable draggableId={deal.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-3 mb-3 rounded-md border ${snapshot.isDragging ? 'border-color-primary shadow-lg' : 'border-border-color shadow-sm'}`}
                >
                    <p className="font-semibold text-sm text-text-dark">{deal.company}</p>
                    <p className="text-xs text-text-muted">{deal.content}</p>
                    <p className="text-sm font-bold text-color-primary mt-2">
                        {deal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            )}
        </Draggable>
    )
}

const StageColumn: React.FC<{ stage: Stage, deals: Deal[] }> = ({ stage, deals }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-2 flex flex-col w-72 shrink-0">
            <div className="flex justify-between items-center mb-3 px-2">
                 <h3 className="font-semibold text-sm text-text-muted uppercase">{stage.title}</h3>
                 <span className="text-sm font-bold text-text-dark">{deals.length}</span>
            </div>
            <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-grow min-h-[100px] rounded-md p-1 transition-colors ${snapshot.isDraggingOver ? 'bg-color-primary/10' : ''}`}
                    >
                        {deals.map((deal, index) => <DealCard key={deal.id} deal={deal} index={index} />)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}

const PipelinesView: React.FC = () => {
    const [data, setData] = useState<Pipeline>(initialPipelineData);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const start = data.stages[source.droppableId];
        const finish = data.stages[destination.droppableId];

        if (start === finish) {
             const newDealIds = Array.from(start.dealIds);
             newDealIds.splice(source.index, 1);
             newDealIds.splice(destination.index, 0, draggableId);

             const newStage = {
                 ...start,
                 dealIds: newDealIds,
             };
             
             setData(prev => ({
                 ...prev,
                 stages: {
                     ...prev.stages,
                     [newStage.id]: newStage,
                 }
             }));
             return;
        }

        const startDealIds = Array.from(start.dealIds);
        startDealIds.splice(source.index, 1);
        const newStart = {
            ...start,
            dealIds: startDealIds,
        };

        const finishDealIds = Array.from(finish.dealIds);
        finishDealIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            dealIds: finishDealIds,
        };

        setData(prev => ({
            ...prev,
            stages: {
                ...prev.stages,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            }
        }));
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-border-color shrink-0">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Pipelines de Vendas</h1>
                     <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-color-primary text-white rounded-md hover:bg-color-primary-dark">
                        <PlusIcon className="w-4 h-4" />
                        Prospectar empresas
                    </button>
                </div>
                 <div className="flex items-center gap-4 mt-4">
                    <select className="border border-border-color rounded-md px-3 py-1.5 text-sm">
                        <option>Prospect (0)</option>
                    </select>
                    <button className="flex items-center gap-2 border border-border-color rounded-md px-3 py-1.5 text-sm">
                        <FilterIcon className="w-4 h-4 text-text-muted"/>
                        Filtros
                    </button>
                    <button className="px-3 py-1.5 text-sm font-semibold bg-color-primary text-white rounded-md">
                        Negócio
                    </button>
                </div>
            </header>
            <div className="flex-grow p-4 overflow-x-auto">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4">
                        {data.stageOrder.map(stageId => {
                            const stage = data.stages[stageId];
                            const deals = stage.dealIds.map(dealId => data.deals[dealId]);
                            return <StageColumn key={stage.id} stage={stage} deals={deals} />;
                        })}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default PipelinesView;