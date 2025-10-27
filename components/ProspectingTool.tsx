import React, { useState, useCallback } from 'react';
import { generateGeminiContent, createB2BPrompt, B2BFilters } from '../utils/gemini';
import type { Prospect } from '../types';
import { LocationIcon, SearchIcon, LoadingSpinner, PlusIcon, SparklesIcon, BriefcaseIcon, HashtagIcon, CodeBracketIcon, CurrencyDollarIcon, UsersIcon } from './icons/Icons';
import { useApp } from '../contexts/AppContext';
import FilterAccordion from './FilterAccordion';

type SearchTab = 'pessoas' | 'empresas';

const ProspectingTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [useLocation, setUseLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [investigationResults, setInvestigationResults] = useState<Prospect[]>([]);
  const { addSuspects, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState<SearchTab>('pessoas');

  // State for filters
  const [aiPromptFilter, setAiPromptFilter] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [revenueFilter, setRevenueFilter] = useState('');


  const findProspects = useCallback(async () => {
    const mainQuery = aiPromptFilter.trim() || query.trim();
    if (!mainQuery) {
      showNotification('Por favor, insira um termo de busca ou um prompt de IA.', 'error');
      return;
    }
    setIsLoading(true);
    setInvestigationResults([]);

    const filters: B2BFilters = {
        aiPrompt: aiPromptFilter.trim(),
    };

    if (activeTab === 'pessoas') {
        filters.jobTitle = jobTitleFilter.trim();
        filters.location = locationFilter.trim();
    } else { // activeTab === 'empresas'
        filters.industry = industryFilter.trim();
        filters.technologies = techFilter.trim();
        filters.revenue = revenueFilter.trim();
    }


    try {
      const config: any = { tools: [{ googleSearch: {} }] };
      let toolConfig: any;

      if (useLocation) {
        config.tools.push({ googleMaps: {} });
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          toolConfig = { retrievalConfig: { latLng: { latitude: position.coords.latitude, longitude: position.coords.longitude } } };
        } catch (geoError) {
          throw new Error('Não foi possível obter a localização. Verifique as permissões do seu navegador.');
        }
      }
      
      const prompt = createB2BPrompt(query.trim(), filters);
      
      const response = await generateGeminiContent({ contents: prompt, config: config, toolConfig });
      const text = response.text.trim();
      let parsedProspects: Prospect[] = [];

      try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\[[\s\S]*\]|\{[\s\S]*\})/);
        if (!jsonMatch) throw new Error("Nenhum JSON válido encontrado na resposta da IA.");
        const cleanedText = (jsonMatch[1] || jsonMatch[2]).trim();
        const parsedResponse = JSON.parse(cleanedText);
        parsedProspects = Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse];
      } catch (jsonError: any) {
        throw new Error("A resposta da IA não estava em um formato JSON válido.");
      }
      
      if (parsedProspects.length > 0 && parsedProspects[0] && parsedProspects[0].name) {
        setInvestigationResults(parsedProspects);
        showNotification(`${parsedProspects.length} resultado(s) encontrado(s).`, 'success');
      } else {
        throw new Error("Nenhum prospect válido encontrado na resposta da IA.");
      }
    } catch (e: any) {
      console.error(e);
      showNotification(e.message || 'Ocorreu um erro ao buscar prospectos.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [query, useLocation, showNotification, activeTab, aiPromptFilter, jobTitleFilter, locationFilter, industryFilter, techFilter, revenueFilter]);

  const handleAddAsSuspect = (prospectToAdd: Prospect) => {
    addSuspects([prospectToAdd]); 
    setInvestigationResults(prevResults => 
      prevResults.filter(p => (p.cnpj || p.name) !== (prospectToAdd.cnpj || prospectToAdd.name))
    );
  };

  const renderFilters = () => {
    if (activeTab === 'pessoas') {
      return (
        <>
          <FilterAccordion title="Filtros de IA" icon={<SparklesIcon className="w-5 h-5 text-purple-400" />} defaultOpen>
            <textarea value={aiPromptFilter} onChange={e => setAiPromptFilter(e.target.value)} placeholder='Use isto para buscas complexas. Ex: "Diretores de Marketing em fintechs..."' className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" rows={3}></textarea>
          </FilterAccordion>
          <FilterAccordion title="Cargos" icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />}>
             <input type="text" value={jobTitleFilter} onChange={e => setJobTitleFilter(e.target.value)} placeholder="Ex: Diretor de Vendas, CTO" className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </FilterAccordion>
          <FilterAccordion title="Localização" icon={<LocationIcon className="w-5 h-5 text-gray-400" />}>
            <input type="text" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} placeholder="Ex: São Paulo, Brasil" className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <label className="flex items-center gap-2 text-sm mt-2 cursor-pointer">
              <input type="checkbox" checked={useLocation} onChange={() => setUseLocation(!useLocation)} className="w-4 h-4 text-sky-600 bg-gray-600 border-gray-500 rounded focus:ring-sky-500" />
              Perto de mim
            </label>
          </FilterAccordion>
           <FilterAccordion title="# Funcionários" icon={<UsersIcon className="w-5 h-5 text-gray-400" />}>
             {/* Placeholder for employee count filter */}
             <p className="text-xs text-gray-500">Filtros de faixa de funcionários aparecerão aqui.</p>
          </FilterAccordion>
        </>
      );
    }
    return (
        <>
           <FilterAccordion title="Indústria e Palavras-chave" icon={<HashtagIcon className="w-5 h-5 text-gray-400" />} defaultOpen>
            <input type="text" value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} placeholder="Ex: SaaS, Varejo, ERP" className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </FilterAccordion>
           <FilterAccordion title="Tecnologias" icon={<CodeBracketIcon className="w-5 h-5 text-gray-400" />}>
            <input type="text" value={techFilter} onChange={e => setTechFilter(e.target.value)} placeholder="Ex: Salesforce, VTEX" className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </FilterAccordion>
           <FilterAccordion title="Receita ($)" icon={<CurrencyDollarIcon className="w-5 h-5 text-gray-400" />}>
             <input 
                type="text" 
                value={revenueFilter} 
                onChange={e => setRevenueFilter(e.target.value)} 
                placeholder="Ex: $1M - $10M, Acima de $100M" 
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" 
              />
          </FilterAccordion>
        </>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* Sidebar de Filtros */}
      <aside className="w-full lg:w-96 flex-shrink-0 bg-gray-800 p-4 rounded-lg">
        <div className="flex border-b border-gray-700 mb-2">
            <button onClick={() => setActiveTab('pessoas')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'pessoas' ? 'text-white border-b-2 border-sky-500' : 'text-gray-400 hover:text-white'}`}>Pessoas</button>
            <button onClick={() => setActiveTab('empresas')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'empresas' ? 'text-white border-b-2 border-sky-500' : 'text-gray-400 hover:text-white'}`}>Empresas</button>
        </div>
        <div className="space-y-1">
          {renderFilters()}
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca principal (Ex: Sankhya) ou use os filtros..."
              className="w-full bg-gray-800 border-2 border-gray-600 rounded-md py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              onKeyDown={(e) => e.key === 'Enter' && findProspects()}
            />
          </div>
          <button 
            onClick={findProspects} 
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-md transition-colors duration-200 bg-sky-600 text-white font-bold hover:bg-sky-500 disabled:bg-gray-500" 
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : <SearchIcon />}
            <span>Pesquisar</span>
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
            <p className="ml-4 text-lg">Investigando o alvo e suas conexões...</p>
          </div>
        )}

        {!isLoading && investigationResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">Resultados da Investigação</h3>
            <div className="space-y-3">
              {investigationResults.map((prospect, index) => (
                <div key={prospect.cnpj || index} className="bg-gray-800 p-4 rounded-md flex justify-between items-center animate-fade-in">
                  <div>
                    <p className="font-bold text-white">{prospect.tradeName || prospect.name}</p>
                    <p className="text-sm text-gray-400">{prospect.segment}</p>
                  </div>
                  <button 
                    onClick={() => handleAddAsSuspect(prospect)}
                    className="bg-sky-600 hover:bg-sky-500 text-white p-2 rounded-full"
                    title="Adicionar aos Suspects"
                  >
                    <PlusIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && investigationResults.length === 0 && (
          <div className="text-center py-16 text-gray-500 bg-gray-800/30 rounded-lg">
            <p>Use a busca ou os filtros para encontrar novos leads.</p>
            <p className="text-sm">Os resultados aparecerão aqui para você adicionar como Suspects.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProspectingTool;