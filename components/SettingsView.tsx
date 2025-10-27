import React from 'react';
import { useApp } from '../contexts/AppContext';
import { CogIcon, GoogleIcon, LoadingSpinner } from './icons/Icons';

const SettingsView: React.FC = () => {
    const { 
        isGoogleConnected,
        handleGoogleConnect,
        importGoogleContacts,
        exportGoogleContacts
    } = useApp();
    
    // Simulação de estado de carregamento para as ações
    const [isConnecting, setIsConnecting] = React.useState(false);
    const [isImporting, setIsImporting] = React.useState(false);
    const [isExporting, setIsExporting] = React.useState(false);

    const onConnectClick = () => {
        setIsConnecting(true);
        // Simula uma chamada de API
        setTimeout(() => {
            handleGoogleConnect();
            setIsConnecting(false);
        }, 1000);
    };

    const onImportClick = () => {
        setIsImporting(true);
        setTimeout(() => {
            importGoogleContacts();
            setIsImporting(false);
        }, 1500);
    };

    const onExportClick = () => {
        setIsExporting(true);
        setTimeout(() => {
            exportGoogleContacts();
            setIsExporting(false);
        }, 1500);
    };


    return (
        <div className="animate-fade-in w-full max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Configurações</h1>
                <p className="text-gray-400 mt-1">Gerencie suas integrações, personas e preferências da conta.</p>
            </header>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold text-sky-400 mb-4 border-b border-gray-700 pb-3">Integrações Disponíveis</h2>
                
                <div className="bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <GoogleIcon className="w-10 h-10 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-white">Google Contacts</h3>
                            <p className="text-sm text-gray-400">Sincronize seus contatos do Google para importar ou exportar leads.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {isGoogleConnected ? (
                            <>
                                <button
                                  onClick={onImportClick}
                                  disabled={isImporting}
                                  className="text-sm flex items-center gap-2 px-3 py-1.5 rounded-md bg-sky-800 hover:bg-sky-700 disabled:bg-gray-600"
                                >
                                  {isImporting ? <LoadingSpinner className="w-4 h-4" /> : null}
                                  {isImporting ? 'Importando...' : 'Importar Contatos'}
                                </button>
                                <button
                                  onClick={onExportClick}
                                  disabled={isExporting}
                                  className="text-sm flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-600 hover:bg-gray-500 disabled:bg-gray-600"
                                >
                                  {isExporting ? <LoadingSpinner className="w-4 h-4" /> : null}
                                  {isExporting ? 'Exportando...' : 'Exportar Prospects'}
                                </button>
                                <button onClick={onConnectClick} className="text-sm px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500">
                                    Desconectar
                                </button>
                            </>
                        ) : (
                             <button
                                onClick={onConnectClick}
                                disabled={isConnecting}
                                className="font-semibold flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 disabled:bg-gray-500"
                             >
                                {isConnecting ? <LoadingSpinner /> : null}
                                {isConnecting ? 'Conectando...' : 'Conectar'}
                            </button>
                        )}
                    </div>
                </div>
                {/* Outras integrações podem ser adicionadas aqui no futuro */}
            </div>
        </div>
    );
};

export default SettingsView;