import React from 'react';
// FIX: Add file extension to fix module resolution error.
import { useApp } from '../contexts/AppContext.tsx';
// FIX: Add file extension to fix module resolution error.
import { WandIcon, EmailTemplateIcon, WriteIcon } from './icons/Icons.tsx';

const BuilderCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => (
    <div 
        className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg hover:border-color-primary transition-all cursor-pointer"
        onClick={onClick}
    >
        <div className="flex justify-center mb-4 text-color-primary">{icon}</div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

const SequenceBuilderView: React.FC = () => {
    const { setActiveView } = useApp();

    const wandIcon = <WandIcon className="w-8 h-8" />;
    const templateIcon = <EmailTemplateIcon className="w-8 h-8" />;
    const writeIcon = <WriteIcon className="w-8 h-8" />;

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fade-in">
            <button onClick={() => setActiveView('automation')} className="text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6">
                &larr; Voltar para Sequências
            </button>
            <h1 className="text-2xl font-bold text-center mb-2">Selecione um construtor de sequência para começar</h1>
            <p className="text-center text-gray-500 mb-10">Quer usar um modelo ou criar do zero, construímos sequências com facilidade.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <BuilderCard 
                    icon={wandIcon} 
                    title="Assistente de IA" 
                    description="Aproveite os recursos de IA para impulsionar suas sequências de e-mail."
                    onClick={() => console.log('AI Assistant clicked')}
                />
                <BuilderCard 
                    icon={templateIcon}
                    title="Modelos de e-mail"
                    description="Agilize o processo com modelos de e-mail com um toque personalizado."
                    onClick={() => console.log('Email templates clicked')}
                />
                <BuilderCard 
                    icon={writeIcon}
                    title="Crie do zero"
                    description="Escreva e-mails originais e crie a política você mesmo."
                    onClick={() => console.log('Create from scratch clicked')}
                />
            </div>
        </div>
    );
};

export default SequenceBuilderView;