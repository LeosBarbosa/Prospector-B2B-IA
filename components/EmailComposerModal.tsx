import React, { useState, useEffect, useCallback } from 'react';
import { generateGeminiContent } from '../utils/gemini';
import type { SavedProspect } from '../types';
import type { Task } from '../types';
import { LoadingSpinner, CopyIcon, SendIcon } from './icons/Icons';

interface EmailComposerModalProps {
  prospect: SavedProspect;
  task: Task;
  onClose: () => void;
  onMarkComplete: () => void;
}

const EmailComposerModal: React.FC<EmailComposerModalProps> = ({ prospect, task, onClose, onMarkComplete }) => {
  const [emailBody, setEmailBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const generateEmail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const connectionPoints = prospect.partners
        ?.flatMap(p => p.connectionPoints || [])
        .filter(Boolean)
        .join(', ') || 'Nenhuma';

      const prompt = `
        Você é um copywriter de vendas de elite, especialista em cold emails B2B. Sua tarefa é escrever um e-mail de prospecção conciso, personalizado e persuasivo.

        **REGRAS:**
        - Seja direto e respeitoso.
        - O e-mail deve ser curto (máximo 4-5 frases).
        - Comece com uma linha de assunto (subject line) curta e que gere curiosidade.
        - Personalize o e-mail usando os dados fornecidos.
        - Termine com uma chamada para ação (call-to-action) clara e de baixo atrito (ex: pedir por 15 minutos, não uma demonstração de 1 hora).

        **Dados do Prospect:**
        - Nome da Empresa: ${prospect.name} (${prospect.tradeName || ''})
        - Segmento: ${prospect.segment || 'Não informado'}
        - Contatos-Chave: ${prospect.partners?.map(p => `${p.name} (${p.qualification})`).join(', ') || 'Não informado'}
        - Pontos de Conexão (via LinkedIn): ${connectionPoints}
        
        **Contexto da Cadência:**
        - Objetivo da Tarefa Atual: "${task.description}"

        **FORMATO DE SAÍDA (APENAS O TEXTO DO EMAIL, INCLUINDO "Assunto:"):**
        Assunto: [Seu Assunto Criativo Aqui]

        [Corpo do E-mail Aqui]
      `;
      const response = await generateGeminiContent({ contents: prompt });
      setEmailBody(response.text);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Não foi possível gerar o e-mail. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [prospect, task]);

  useEffect(() => {
    generateEmail();
  }, [generateEmail]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700 flex flex-col max-h-[90vh]">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-sky-400">Assistente de E-mail IA</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </header>

        <main className="p-6 flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <LoadingSpinner className="h-8 w-8 text-sky-500" />
              <p className="mt-4 text-gray-400">Gerando e-mail personalizado...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>
          ) : (
            <textarea
              readOnly
              value={emailBody}
              className="w-full h-full bg-gray-900/50 text-gray-200 p-4 rounded-md border border-gray-600 focus:ring-sky-500 focus:border-sky-500 font-mono text-sm resize-none"
              rows={15}
            />
          )}
        </main>

        <footer className="flex justify-end items-center gap-3 p-4 border-t border-gray-700 shrink-0">
          <button 
            onClick={handleCopy} 
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            <CopyIcon />
            {copySuccess ? 'Copiado!' : 'Copiar'}
          </button>
          <button 
            onClick={onMarkComplete} 
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 transition-colors"
          >
            <SendIcon />
            Marcar como Concluída
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EmailComposerModal;