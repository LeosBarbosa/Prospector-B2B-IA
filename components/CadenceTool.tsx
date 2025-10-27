import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WorkflowTemplate } from '../types';
import { LinearFlowIcon, MultiBranchIcon, PipelineIcon, SparklesIcon } from './icons/Icons';

const templates: WorkflowTemplate[] = [
    {
        id: 'linear',
        name: 'Converter clientes ideais com sequências de IA',
        description: 'Quando um contato se alinhar ao seu ICP, inscreva-o em uma lista e envie uma sequência elaborada por IA.',
        icon: <LinearFlowIcon />
    },
    {
        id: 'multi-branch',
        name: 'Visitantes do site alvo',
        description: 'Este modelo identificará automaticamente empresas que estão visitando ativamente seu site.',
        icon: <MultiBranchIcon />
    },
    {
        id: 'generate-pipeline',
        name: 'Gerar pipeline',
        description: 'Envie e-mails para empresas que pesquisam sua categoria com divulgação de IA.',
        icon: <PipelineIcon />
    }
];

const CadenceTool: React.FC = () => {
  const { handleSelectTemplate } = useApp();

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Fluxos de Trabalho</h1>
        <p className="text-gray-400 mt-1">Selecione um modelo para começar a automatizar seu engajamento.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className="bg-gray-800 p-6 rounded-lg text-left hover:bg-gray-700/50 hover:border-sky-500 border border-transparent transition-all"
          >
            <div className="text-sky-400 mb-3">{template.icon}</div>
            <h2 className="font-bold text-white mb-2">{template.name}</h2>
            <p className="text-sm text-gray-400">{template.description}</p>
          </button>
        ))}
        <div className="bg-gray-800/50 p-6 rounded-lg border border-dashed border-gray-600 flex flex-col items-center justify-center text-center">
            <SparklesIcon className="text-purple-400 w-8 h-8 mb-3" />
            <h2 className="font-bold text-white mb-2">Workflow Personalizado com IA</h2>
            <p className="text-sm text-gray-400">Em breve: Descreva seu processo de vendas ideal e deixe a IA construir um fluxo de trabalho para você.</p>
        </div>
      </div>
    </div>
  );
};

export default CadenceTool;
