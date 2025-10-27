import React, { createContext, useState, useEffect, useContext, useRef, FC, ReactNode } from 'react';
import * as XLSX from 'xlsx';
import { 
    AppView, Prospect, Cadence, SavedProspect, Notification, NotificationType, 
    Confirmation, AppContextType, Suspect, LinkedCompany, QualificationAnalysis, Partner, SheetRow,
    Goal, WorkflowTemplate
} from '../types';
import { generateGeminiContent, createB2BPrompt, createQualificationPrompt, createFindContactsPrompt } from '../utils/gemini';
import { defaultSessionData } from '../utils/defaultSession';


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
    const [isLoadingState, setIsLoadingState] = useState(true);
    const [isSessionLoaded, setIsSessionLoaded] = useState(false);
    
    const [suspects, setSuspects] = useState<Suspect[]>([]);
    const [savedProspects, setSavedProspects] = useState<SavedProspect[]>([]);
    const [cadences, setCadences] = useState<Cadence[]>([]);
    const [isQualifyingId, setIsQualifyingId] = useState<string | null>(null);
    const [isFindingContactsId, setIsFindingContactsId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const sheetFileInputRef = useRef<HTMLInputElement | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState('');
    const [isSheetPreviewOpen, setIsSheetPreviewOpen] = useState(false);
    const [sheetPreviewData, setSheetPreviewData] = useState<SheetRow[]>([]);

    // Goals
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);

    // Workflows
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

    // Integrations
    const [isGoogleConnected, setIsGoogleConnected] = useState(false);


    useEffect(() => {
        const loadState = () => {
            try {
                const savedSuspectsItem = window.localStorage.getItem('suspects');
                const savedProspectsItem = window.localStorage.getItem('savedProspects');
                const cadencesItem = window.localStorage.getItem('cadences');
                const goalsItem = window.localStorage.getItem('goals');
                const googleConnectedItem = window.localStorage.getItem('isGoogleConnected');


                if (savedSuspectsItem || savedProspectsItem || cadencesItem) {
                    const prospectsData = savedProspectsItem ? JSON.parse(savedProspectsItem) : [];
                    const migratedProspects = prospectsData.map((p: SavedProspect) => ({
                        ...p,
                        savedAt: p.savedAt || new Date().toISOString()
                    }));
                    
                    setSuspects(savedSuspectsItem ? JSON.parse(savedSuspectsItem) : []);
                    setSavedProspects(migratedProspects);
                    setCadences(cadencesItem ? JSON.parse(cadencesItem) : []);
                    setGoals(goalsItem ? JSON.parse(goalsItem) : []);
                    setIsGoogleConnected(googleConnectedItem ? JSON.parse(googleConnectedItem) : false);
                    showNotification("Sessão anterior carregada do cache do navegador.", "success");
                } else {
                     setSuspects(defaultSessionData.suspects || []);
                     setSavedProspects(defaultSessionData.savedProspects || []);
                     setCadences(defaultSessionData.cadences || []);
                     setGoals([]);
                     setIsGoogleConnected(false);
                     showNotification("Bem-vindo! Sessão de desenvolvimento padrão carregada.", "info");
                }
            } catch (error) {
                console.error("Erro ao carregar o estado", error);
                showNotification("Não foi possível carregar a sessão. Carregando sessão padrão.", "error");
                setSuspects(defaultSessionData.suspects || []);
                setSavedProspects(defaultSessionData.savedProspects || []);
                setCadences(defaultSessionData.cadences || []);
                setGoals([]);
                setIsGoogleConnected(false);
            } finally {
                setIsSessionLoaded(true);
                setIsLoadingState(false);
            }
        };
        const timer = setTimeout(loadState, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => { !isLoadingState && window.localStorage.setItem('suspects', JSON.stringify(suspects)); }, [suspects, isLoadingState]);
    useEffect(() => { !isLoadingState && window.localStorage.setItem('savedProspects', JSON.stringify(savedProspects)); }, [savedProspects, isLoadingState]);
    useEffect(() => { !isLoadingState && window.localStorage.setItem('cadences', JSON.stringify(cadences)); }, [cadences, isLoadingState]);
    useEffect(() => { !isLoadingState && window.localStorage.setItem('goals', JSON.stringify(goals)); }, [goals, isLoadingState]);
    useEffect(() => { !isLoadingState && window.localStorage.setItem('isGoogleConnected', JSON.stringify(isGoogleConnected)); }, [isGoogleConnected, isLoadingState]);

    const showNotification = (message: string, type: NotificationType = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const addSuspects = (newSuspects: Prospect[], source: string = 'prospecção') => {
        const existingIdentifiers = new Set([...suspects, ...savedProspects].map(s => s.cnpj || s.name));
        
        const newSuspectsWithId = newSuspects
            .map(s => ({ ...s, id: crypto.randomUUID() }))
            .filter(newS => !existingIdentifiers.has(newS.cnpj || newS.name));

        if (newSuspectsWithId.length === 0) {
            if(newSuspects.length > 0) {
              showNotification(`Todos os ${newSuspects.length} resultado(s) da ${source} já estão em suas listas.`, 'info');
            }
            return;
        }

        setSuspects(prev => [...newSuspectsWithId, ...prev]);
        showNotification(`${newSuspectsWithId.length} novo(s) suspect(s) adicionado(s) via ${source}!`, 'success');
        setActiveView(AppView.LISTS);
    };
    
    const removeSuspect = (suspectId: string) => {
        setSuspects(prev => prev.filter(s => s.id !== suspectId));
    };

    const saveProspect = (suspectToSave: Suspect) => {
        const isAlreadySaved = savedProspects.some(p => (suspectToSave.cnpj && p.cnpj === suspectToSave.cnpj) || p.name === suspectToSave.name);
        if (isAlreadySaved) {
            showNotification('Este prospect já foi salvo.', 'info');
            removeSuspect(suspectToSave.id);
            return;
        }

        const newSavedProspect: SavedProspect = { ...suspectToSave, savedAt: new Date().toISOString() };
        setSavedProspects(prev => [newSavedProspect, ...prev]);
        
        removeSuspect(suspectToSave.id);
        
        showNotification(`"${suspectToSave.tradeName || suspectToSave.name}" salvo como Prospect!`, 'success');
    };
    
    const updateProspect = (prospectId: string, updatedProspectData: Prospect) => {
        let found = false;
        // Try updating in suspects
        const newSuspects = suspects.map(s => {
            if (s.id === prospectId) {
                found = true;
                return { ...s, ...updatedProspectData, id: s.id };
            }
            return s;
        });
        if (found) {
            setSuspects(newSuspects);
            showNotification('Suspect atualizado com sucesso!', 'success');
            return;
        }

        // Try updating in saved prospects
        const newSavedProspects = savedProspects.map(p => {
            if (p.id === prospectId) {
                found = true;
                return { ...p, ...updatedProspectData, id: p.id, savedAt: p.savedAt };
            }
            return p;
        });

        if(found) {
            setSavedProspects(newSavedProspects);
            showNotification('Prospect atualizado com sucesso!', 'success');
        }
    };


    const qualifyAndSaveSuspect = async (suspectId: string) => {
        const suspectToQualify = suspects.find(s => s.id === suspectId);
        if (!suspectToQualify) {
            showNotification('Suspect não encontrado para qualificação.', 'error');
            return;
        }
    
        setIsQualifyingId(suspectId);
        showNotification(`Iniciando qualificação de ${suspectToQualify.tradeName || suspectToQualify.name}...`, 'info');
    
        try {
            const prompt = createQualificationPrompt(suspectToQualify);
            const response = await generateGeminiContent({ contents: prompt });
            const text = response.text.trim();
            
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
            if (!jsonMatch) throw new Error("Resposta da IA em formato inválido para qualificação.");
    
            const cleanedText = (jsonMatch[1] || jsonMatch[2]).trim();
            const qualificationAnalysis: QualificationAnalysis = JSON.parse(cleanedText);
    
            const newSavedProspect: SavedProspect = { 
                ...suspectToQualify, 
                savedAt: new Date().toISOString(),
                qualificationAnalysis: qualificationAnalysis 
            };
            
            const isAlreadySaved = savedProspects.some(p => (newSavedProspect.cnpj && p.cnpj === newSavedProspect.cnpj) || p.name === newSavedProspect.name);
            if (isAlreadySaved) {
                showNotification('Este prospect já foi salvo.', 'info');
                removeSuspect(suspectToQualify.id);
                return;
            }

            setSavedProspects(prev => [newSavedProspect, ...prev]);
            removeSuspect(suspectToQualify.id);
            
            showNotification(`"${suspectToQualify.tradeName || suspectToQualify.name}" qualificado e salvo como Prospect!`, 'success');
    
        } catch (error: any) {
            console.error("Erro ao qualificar suspect:", error);
            showNotification(`Falha na qualificação: ${error.message}`, "error");
        } finally {
            setIsQualifyingId(null);
        }
    };
    
    const investigateAndSaveLinkedCompany = async (company: LinkedCompany) => {
        showNotification(`Iniciando investigação sobre ${company.name}...`, 'info');
        try {
            const prompt = createB2BPrompt(company.cnpj || company.name);
            const response = await generateGeminiContent({ contents: prompt, config: { tools: [{ googleSearch: {} }] } });
            const text = response.text.trim();
            
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\[[\s\S]*\]|\{[\s\S]*\})/);
            if (!jsonMatch) throw new Error("Resposta da IA em formato inválido.");

            const cleanedText = (jsonMatch[1] || jsonMatch[2]).trim();
            const parsedResponse = JSON.parse(cleanedText);
            const foundProspect = Array.isArray(parsedResponse) ? parsedResponse[0] : parsedResponse;
            
            if (foundProspect && foundProspect.name) {
                const suspectToSave: Suspect = { ...foundProspect, id: crypto.randomUUID() };
                saveProspect(suspectToSave);
            } else {
                 throw new Error("Nenhum prospect válido encontrado.");
            }
        } catch (error: any) {
            console.error("Erro ao investigar empresa vinculada:", error);
            showNotification(`Falha na investigação de ${company.name}: ${error.message}`, "error");
        }
    };


    const removeSavedProspect = (prospectId: string) => {
        setConfirmation({
            title: "Remover Prospect Salvo",
            message: "Tem certeza que deseja remover este prospect? Isso também o removerá de qualquer cadência.",
            onConfirm: () => {
                setSavedProspects(prev => prev.filter(p => p.id !== prospectId));
                setCadences(prev => prev.map(c => ({
                    ...c,
                    prospectIds: c.prospectIds.filter(id => id !== prospectId),
                    tasksByProspectId: Object.fromEntries(Object.entries(c.tasksByProspectId).filter(([id]) => id !== prospectId))
                })));
                showNotification('Prospect removido.', 'success');
                setConfirmation(null);
            }
        });
    };

    const handleExport = () => {
        const sessionData = { suspects, savedProspects, cadences, goals };
        const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prospector-b2b-session-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Sessão exportada com sucesso!', 'success');
    };
    
    const handleExportSheet = () => {
        if (savedProspects.length === 0) {
          showNotification('Não há prospects salvos para exportar.', 'info');
          return;
        }
    
        const flattenedData = savedProspects.map(p => {
          const baseData: any = {
            'Nome Fantasia': p.tradeName || p.name,
            'Razão Social': p.name,
            'CNPJ': p.cnpj,
            'Descrição': p.description,
            'Website': p.website,
            'Telefone': p.phone,
            'Endereço': p.address,
            'Atividade Principal': p.mainActivity,
            'Faturamento Estimado': p.revenueRange,
            'Segmento': p.segment,
            'Nº de Funcionários': p.numberOfEmployees,
            'Probabilidade de Conversão': p.conversionProbability?.score,
            'Justificativa da Probabilidade': p.conversionProbability?.justification,
            'Notícias Recentes': p.recentNews,
            'Clientes Potenciais': p.potentialClients?.map(c => `${c.clientName} (${c.reason})`).join('; ') || '',
          };
    
          p.partners?.forEach((partner, index) => {
            const i = index + 1;
            baseData[`Contato ${i} Nome`] = partner.name;
            baseData[`Contato ${i} Cargo`] = partner.qualification;
            baseData[`Contato ${i} Email`] = partner.email;
            baseData[`Contato ${i} Telefone`] = partner.phone;
            baseData[`Contato ${i} LinkedIn`] = partner.linkedinProfileUrl;
          });
    
          return baseData;
        });
    
        const worksheet = XLSX.utils.json_to_sheet(flattenedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Prospects');
        XLSX.writeFile(workbook, 'prospector_b2b_export.xlsx');
        showNotification('Prospects exportados para planilha com sucesso!', 'success');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const loadSessionData = (data: any) => {
      setSuspects(data.suspects || []);
      setSavedProspects(data.savedProspects || []);
      setCadences(data.cadences || []);
      setGoals(data.goals || []);
      setIsSessionLoaded(true);
      showNotification('Sessão importada com sucesso!', 'success');
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    if (data && typeof data === 'object') {
                       if (!isSessionLoaded) {
                          loadSessionData(data);
                       } else {
                         setConfirmation({
                            title: "Importar Sessão (.json)",
                            message: "Isso substituirá todos os suspects, prospects e cadências atuais. Deseja continuar?",
                            onConfirm: () => {
                                loadSessionData(data);
                                setConfirmation(null);
                            }
                        });
                       }
                    } else {
                        throw new Error('Formato de arquivo inválido.');
                    }
                } catch (err: any) {
                    showNotification(`Erro ao importar: ${err.message}`, 'error');
                }
            };
            reader.readAsText(file);
            if (event.target) event.target.value = '';
        }
    };
    
    const handleSheetFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
        if (json.length < 2) throw new Error("A planilha está vazia ou contém apenas o cabeçalho.");
    
        const header = json[0].map(h => String(h));
        const rows = json.slice(1);
    
        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/gi, '');
        const keywords = ['empresa', 'cliente', 'prospect', 'suspect', 'lead', 'oportunidade', 'contato', 'name', 'razaosocial'];
        
        let companyColumnIndex = -1;
        for (const keyword of keywords) {
          companyColumnIndex = header.findIndex(h => normalize(h).includes(keyword));
          if (companyColumnIndex !== -1) break;
        }
    
        if (companyColumnIndex === -1) {
          throw new Error("Nenhuma coluna de empresa (ex: 'Empresa', 'Cliente', 'CNPJ') encontrada na planilha.");
        }
    
        const rawData = rows.map((row, index) => ({ id: index, data: header.reduce((obj, key, i) => ({ ...obj, [key]: row[i] }), {}) }));
    
        // Deduplication
        const uniqueEntries = new Map<string, SheetRow>();
        rawData.forEach(row => {
          const key = String(row.data[header[companyColumnIndex]]).trim().toLowerCase();
          if (!key) return;
          
          const existing = uniqueEntries.get(key);
          const currentInfoCount = Object.values(row.data).filter(Boolean).length;
          
          if (!existing || currentInfoCount > Object.values(existing.data).filter(Boolean).length) {
            uniqueEntries.set(key, row);
          }
        });
        
        setSheetPreviewData(Array.from(uniqueEntries.values()));
        setIsSheetPreviewOpen(true);
    
      } catch (err: any) {
        showNotification(`Erro ao processar a planilha: ${err.message}`, 'error');
      } finally {
        if (event.target) event.target.value = '';
      }
    };

    const closeSheetPreview = () => {
      setIsSheetPreviewOpen(false);
      setSheetPreviewData([]);
    };

    const processSheetSelection = async (selectedIds: number[]) => {
        const selectedRows = sheetPreviewData.filter(row => selectedIds.includes(row.id));
        closeSheetPreview();

        if (selectedRows.length === 0) {
            showNotification('Nenhum registro foi selecionado para análise.', 'info');
            return;
        }

        setIsImporting(true);
        let results: Prospect[] = [];

        const header = Object.keys(sheetPreviewData[0].data);
        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/gi, '');
        const keywords = ['empresa', 'cliente', 'prospect', 'suspect', 'lead', 'oportunidade', 'contato', 'name', 'razaosocial'];
        
        let companyColumn = '';
        for (const keyword of keywords) {
          const foundHeader = header.find(h => normalize(h).includes(keyword));
          if (foundHeader) {
            companyColumn = foundHeader;
            break;
          }
        }

        for (let i = 0; i < selectedRows.length; i++) {
            const companyQuery = selectedRows[i].data[companyColumn];
            if (!companyQuery) continue;

            setImportProgress(`Analisando ${i + 1} de ${selectedRows.length}: ${companyQuery}`);
            
            try {
                const prompt = createB2BPrompt(String(companyQuery));
                const response = await generateGeminiContent({ contents: prompt, config: { tools: [{ googleSearch: {} }] } });
                const text = response.text.trim();
                const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\[[\s\S]*\]|\{[\s\S]*\})/);
                if (jsonMatch) {
                    const cleanedText = (jsonMatch[1] || jsonMatch[2]).trim();
                    const parsed = JSON.parse(cleanedText);
                    results = results.concat(Array.isArray(parsed) ? parsed : [parsed]);
                }
            } catch (innerError) {
                console.error(`Falha ao analisar "${companyQuery}":`, innerError);
            }
        }
        
        setIsImporting(false);
        setImportProgress('');
        addSuspects(results, 'planilha');
    }

     const findMoreContacts = async (prospectId: string, type: 'suspect' | 'prospect') => {
        setIsFindingContactsId(prospectId);
        
        const targetList = type === 'suspect' ? suspects : savedProspects;
        const targetProspect = targetList.find(p => p.id === prospectId);

        if (!targetProspect) {
            showNotification('Prospect não encontrado para buscar mais contatos.', 'error');
            setIsFindingContactsId(null);
            return;
        }
        
        try {
            const existingContactNames = targetProspect.partners?.map(p => p.name) || [];
            const prompt = createFindContactsPrompt(targetProspect, existingContactNames);
            const response = await generateGeminiContent({
                contents: prompt,
                config: { tools: [{ googleSearch: {} }] }
            });
            const text = response.text.trim();
            
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\[[\s\S]*\])/);
            if (!jsonMatch) throw new Error("Resposta da IA em formato inválido para busca de contatos.");

            const cleanedText = (jsonMatch[1] || jsonMatch[2]).trim();
            const newPartners: Partner[] = JSON.parse(cleanedText);

            if (newPartners.length === 0) {
                showNotification('Nenhum novo contato encontrado.', 'info');
                return;
            }

            const updateFunction = (list: any[]) => list.map(p => {
                if (p.id === prospectId) {
                    const existingPartners = p.partners || [];
                    const allPartners = [...existingPartners, ...newPartners];
                    const uniquePartners = Array.from(new Map(allPartners.map(item => [item.name, item])).values());
                    return { ...p, partners: uniquePartners };
                }
                return p;
            });

            if (type === 'suspect') {
                setSuspects(updateFunction);
            } else {
                setSavedProspects(updateFunction);
            }

            showNotification(`${newPartners.length} novo(s) contato(s) adicionado(s) a "${targetProspect.tradeName || targetProspect.name}"!`, 'success');

        } catch (error: any) {
            console.error("Erro ao buscar mais contatos:", error);
            showNotification(`Falha ao buscar contatos: ${error.message}`, "error");
        } finally {
            setIsFindingContactsId(null);
        }
    };
    
    const addGoal = (goal: Omit<Goal, 'id'>) => {
        const newGoal = { ...goal, id: crypto.randomUUID() };
        setGoals(prev => [...prev, newGoal]);
        setIsGoalModalOpen(false);
        showNotification('Nova meta criada com sucesso!', 'success');
    };

    const handleSelectTemplate = (template: WorkflowTemplate) => {
        setSelectedTemplate(template);
        setIsTemplateModalOpen(true);
    };

    const handleContinueToPersonalization = () => {
        if (!selectedTemplate) return;
        setIsTemplateModalOpen(false);
        setIsPersonalizationModalOpen(true);
    };

    const handleCreateWorkflow = (personalization: { painPoints: string; valueProp: string }) => {
        console.log('Creating workflow with:', selectedTemplate, personalization);
        showNotification('Fluxo de trabalho sendo criado pela IA...', 'info');
        closeWorkflowModals();
    };

    const closeWorkflowModals = () => {
        setIsTemplateModalOpen(false);
        setIsPersonalizationModalOpen(false);
        setSelectedTemplate(null);
    };

    const handleGoogleConnect = () => {
        setIsGoogleConnected(prev => !prev);
        showNotification(
            !isGoogleConnected ? 'Conectado ao Google Contacts com sucesso!' : 'Desconectado do Google Contacts.',
            'success'
        );
    };

    const importGoogleContacts = () => {
        showNotification('Importando contatos do Google... (Funcionalidade simulada)', 'info');
    };

    const exportGoogleContacts = () => {
        showNotification('Exportando prospects para o Google Contacts... (Funcionalidade simulada)', 'info');
    };

    const value: AppContextType = {
        activeView, setActiveView, notifications, showNotification,
        confirmation, setConfirmation, handleExport, handleImportClick,
        handleExportSheet,
        handleFileChange, handleSheetFileChange, fileInputRef, sheetFileInputRef,
        isLoadingState, isImporting, importProgress, isSessionLoaded,
        isSheetPreviewOpen, sheetPreviewData, processSheetSelection, closeSheetPreview,
        suspects, addSuspects, removeSuspect, setSuspects, updateProspect,
        savedProspects, saveProspect, removeProspect: removeSavedProspect, investigateAndSaveLinkedCompany,
        qualifyAndSaveSuspect, isQualifyingId, findMoreContacts, isFindingContactsId,
        cadences, setCadences,
        // Goals
        isGoalModalOpen,
        setIsGoalModalOpen,
        goals,
        addGoal,
        // Workflows
        isTemplateModalOpen,
        isPersonalizationModalOpen,
        selectedTemplate,
        handleSelectTemplate,
        handleContinueToPersonalization,
        handleCreateWorkflow,
        closeWorkflowModals,
        // Integrations
        isGoogleConnected,
        handleGoogleConnect,
        importGoogleContacts,
        exportGoogleContacts,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp deve ser usado dentro de um AppProvider');
    }
    return context;
};

export const useSuspects = () => useApp();
export const useSavedProspects = () => useApp();
export const useCadences = () => useApp();