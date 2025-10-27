import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { getGeminiClient } from '../utils/gemini';
import type { ChatMessage } from '../types';
import { SendIcon, LoadingSpinner } from './icons/Icons';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeChat = useCallback(() => {
    try {
      const ai = getGeminiClient();
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'Você é um assistente de IA especializado em vendas e prospecção B2B. Forneça dicas, rascunhe e-mails, analise perfis de leads e ajude os usuários a terem sucesso em suas campanhas de vendas.',
        },
      });
    } catch (e) {
      console.error("Failed to initialize chat:", e);
      setError("Não foi possível iniciar o assistente. Verifique sua configuração.");
    }
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!chatRef.current) {
        throw new Error("Chat não inicializado.");
      }
      const stream = await chatRef.current.sendMessageStream({ message: input });

      let botResponse = '';
      setMessages((prev) => [...prev, { sender: 'bot', text: '' }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'bot', text: botResponse };
          return newMessages;
        });
      }
    } catch (e: any) {
      console.error(e);
      setError('Ocorreu um erro ao obter a resposta. Tente novamente.');
      setMessages(prev => [...prev, { sender: 'bot', text: 'Desculpe, não consegui processar sua solicitação.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-sky-400 text-center">Assistente de Vendas IA</h2>
      <div className="flex-grow overflow-y-auto pr-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                AI
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-sky-700 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1]?.sender === 'user' && (
           <div className="flex items-end gap-2 justify-start">
             <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                AI
              </div>
             <div className="max-w-md p-3 rounded-lg bg-gray-700 text-gray-200 rounded-bl-none">
               <LoadingSpinner />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-2 rounded-md my-2 text-sm">{error}</div>}

      <div className="mt-4 flex items-center gap-2 border-t border-gray-700 pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Peça para criar um email de cold call..."
          className="flex-grow bg-gray-700 border-2 border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-sky-600 text-white p-3 rounded-md hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;