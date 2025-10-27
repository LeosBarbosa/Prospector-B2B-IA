import React, { useState } from 'react';
import type { Prospect, Partner, Suspect, SavedProspect } from '../types';
import { 
    GlobeIcon, IdentificationIcon, BuildingOfficeIcon, UserCircleIcon, 
    EmailIcon, PhoneIcon, LocationIcon, DollarIcon, TagIcon, LinkIcon, LinkedInIcon, 
    BriefcaseIcon, LightbulbIcon, ClipboardListIcon, NewspaperIcon, AcademicCapIcon, ChevronDownIcon,
    TrashIcon, StarIcon, UsersIcon, CheckBadgeIcon, LoadingSpinner, InformationCircleIcon, UserPlusIcon,
    EditIcon, CancelIcon, CheckIcon
} from './icons/Icons';

interface ProspectCardProps {
  prospect: Suspect | SavedProspect;
  onSave?: () => void;
  onRemove?: () => void;
  onQualify?: () => void;
  isQualifying?: boolean;
  onFindMoreContacts?: () => void;
  isFindingContacts?: boolean;
  onUpdate?: (prospectId: string, updatedProspect: Prospect) => void;
}

const ProspectCard: React.FC<ProspectCardProps> = ({ 
    prospect, onSave, onRemove, onQualify, isQualifying, onFindMoreContacts, isFindingContacts, onUpdate
}) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [openPartnerIndex, setOpenPartnerIndex] = useState<number | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProspect, setEditedProspect] = useState<Prospect>(prospect);

  const handleEdit = () => {
    setEditedProspect(JSON.parse(JSON.stringify(prospect))); // Deep copy to avoid mutation
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate?.(prospect.id, editedProspect);
    setIsEditing(false);
  };
  
  const handleProspectChange = (field: keyof Prospect, value: any) => {
    setEditedProspect(prev => ({ ...prev, [field]: value }));
  };

  const handlePartnerChange = (index: number, field: keyof Partner, value: string) => {
    setEditedProspect(prev => {
        const newPartners = [...(prev.partners || [])];
        newPartners[index] = { ...newPartners[index], [field]: value };
        return { ...prev, partners: newPartners };
    });
  };

  const handleAddPartner = () => {
    const newPartner: Partner = { name: '', qualification: '' };
    setEditedProspect(prev => ({ ...prev, partners: [...(prev.partners || []), newPartner]}));
  };
  
  const handleRemovePartner = (index: number) => {
     setEditedProspect(prev => ({ ...prev, partners: prev.partners?.filter((_, i) => i !== index) }));
  };


  const handleTogglePartner = (index: number) => {
    setOpenPartnerIndex(prevIndex => (prevIndex === index ? null : index));
  };
  
  const probabilityStyles = {
    Alta: 'bg-green-500 text-green-100',
    Média: 'bg-yellow-500 text-yellow-100',
    Baixa: 'bg-red-500 text-red-100',
  };
  
  const qualificationStatusStyles = {
    Hot: 'bg-red-600',
    Warm: 'bg-yellow-600',
    Cold: 'bg-sky-600',
  };

  const renderEditView = () => (
    <div className="p-5 space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Editando {prospect.tradeName || prospect.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Nome Fantasia" value={editedProspect.tradeName || ''} onChange={e => handleProspectChange('tradeName', e.target.value)} className="bg-gray-800 p-2 rounded border border-gray-600 focus:ring-sky-500 focus:border-sky-500" />
             <input type="text" placeholder="Razão Social" value={editedProspect.name} onChange={e => handleProspectChange('name', e.target.value)} className="bg-gray-800 p-2 rounded border border-gray-600 focus:ring-sky-500 focus:border-sky-500" />
        </div>
        <textarea placeholder="Descrição" value={editedProspect.description} onChange={e => handleProspectChange('description', e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-gray-600 focus:ring-sky-500 focus:border-sky-500" rows={3}></textarea>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Website" value={editedProspect.website || ''} onChange={e => handleProspectChange('website', e.target.value)} className="bg-gray-800 p-2 rounded border border-gray-600" />
             <input type="text" placeholder="CNPJ" value={editedProspect.cnpj || ''} onChange={e => handleProspectChange('cnpj', e.target.value)} className="bg-gray-800 p-2 rounded border border-gray-600" />
             <input type="text" placeholder="Telefone" value={editedProspect.phone || ''} onChange={e => handleProspectChange('phone', e.target.value)} className="bg-gray-800 p-2 rounded border border-gray-600" />
             <input type="text" placeholder="Segmento" value={editedProspect.segment || ''} onChange={e => handleProspectChange('segment', e.target.value)} className="bg-gray-800 p-2 rounded border border-gray-600" />
         </div>

        <div className="border-t border-gray-600 pt-4">
            <h4 className="font-semibold text-gray-300 mb-2">Contatos-Chave</h4>
            <div className="space-y-3">
            {(editedProspect.partners || []).map((partner, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-md space-y-2">
                    <div className="flex gap-2 items-center">
                        <input type="text" placeholder="Nome do Contato" value={partner.name} onChange={e => handlePartnerChange(index, 'name', e.target.value)} className="flex-grow bg-gray-900 p-2 rounded border border-gray-600" />
                        <input type="text" placeholder="Cargo" value={partner.qualification} onChange={e => handlePartnerChange(index, 'qualification', e.target.value)} className="flex-grow bg-gray-900 p-2 rounded border border-gray-600" />
                        <button onClick={() => handleRemovePartner(index)} className="p-2 bg-red-600 hover:bg-red-500 rounded"><TrashIcon/></button>
                    </div>
                    <div className="flex gap-2">
                        <input type="email" placeholder="E-mail" value={partner.email || ''} onChange={e => handlePartnerChange(index, 'email', e.target.value)} className="w-1/2 bg-gray-900 p-2 rounded border border-gray-600" />
                        <input type="text" placeholder="LinkedIn URL" value={partner.linkedinProfileUrl || ''} onChange={e => handlePartnerChange(index, 'linkedinProfileUrl', e.target.value)} className="w-1/2 bg-gray-900 p-2 rounded border border-gray-600" />
                    </div>
                </div>
            ))}
            </div>
            <button onClick={handleAddPartner} className="mt-3 text-sm flex items-center gap-2 px-3 py-1.5 rounded-md bg-sky-800 hover:bg-sky-700"><UserPlusIcon className="w-4 h-4" /> Adicionar Contato</button>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500"><CancelIcon className="w-4 h-4"/> Cancelar</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 font-semibold"><CheckIcon className="w-4 h-4"/> Salvar</button>
        </div>
    </div>
  );

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg border border-gray-600 transition-all duration-300 hover:shadow-sky-500/20 hover:border-sky-600">
      { isEditing ? renderEditView() : (
        <>
            <button
                onClick={() => setIsCardExpanded(!isCardExpanded)}
                className="w-full flex justify-between items-start gap-4 p-5 text-left"
                aria-expanded={isCardExpanded}
                aria-controls={`prospect-details-${prospect.cnpj}`}
            >
                <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-xl font-bold text-white">{prospect.tradeName || prospect.name}</h3>
                    {prospect.conversionProbability && (
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${probabilityStyles[prospect.conversionProbability.score]}`}>
                        <StarIcon className="w-3 h-3"/> {prospect.conversionProbability.score}
                        </span>
                    )}
                </div>

                {!isCardExpanded && prospect.tradeName && <p className="text-sm text-gray-400">{prospect.name}</p>}
                {!isCardExpanded && prospect.segment && <p className="text-sm text-sky-400 mt-1">{prospect.segment}</p>}
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isCardExpanded ? 'rotate-180' : ''}`} />
            </button>

            <div id={`prospect-details-${prospect.cnpj}`} className={`transition-all duration-500 ease-in-out grid ${isCardExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                <div className="px-5 pb-5">
                    {prospect.tradeName && <p className="text-sm text-gray-400 -mt-3 mb-3">{prospect.name}</p>}
                    <div className="flex justify-between items-start">
                        <p className="text-gray-300 mt-1 mb-4 flex-grow pr-4">{prospect.description}</p>
                        <div className="flex flex-col items-stretch gap-2 flex-shrink-0">
                            {prospect.website && (
                            <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="bg-gray-600 hover:bg-sky-600 text-white font-bold p-2 rounded-full transition-colors duration-200 self-center" title="Visitar Website">
                                <GlobeIcon />
                            </a>
                            )}
                            <div className="flex items-center gap-2 w-full">
                                {onRemove && (
                                    <button onClick={onRemove} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors duration-200" title="Remover"><TrashIcon /></button>
                                )}
                                {onUpdate && (
                                    <button onClick={handleEdit} className="bg-gray-600 hover:bg-yellow-500 text-white p-2 rounded-lg transition-colors duration-200" title="Editar"><EditIcon /></button>
                                )}
                                {onQualify && (
                                    <button onClick={onQualify} disabled={isQualifying} className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 disabled:bg-gray-500 flex-grow">
                                        {isQualifying ? <LoadingSpinner className="h-4 w-4" /> : <CheckBadgeIcon className="h-4 w-4" />}
                                        {isQualifying ? 'Qual...' : 'Qualificar'}
                                    </button>
                                )}
                                {onSave && (
                                    <button onClick={onSave} className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors duration-200 flex-grow">SALVAR</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-600 pt-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">DADOS DA EMPRESA</h4>
                        <div className="space-y-2 text-sm">
                        {prospect.cnpj && <div className="flex items-start gap-2"><IdentificationIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><p><span className="font-semibold text-gray-300">CNPJ:</span> {prospect.cnpj}</p></div>}
                        {prospect.phone && <div className="flex items-start gap-2"><PhoneIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><p><span className="font-semibold text-gray-300">Telefone:</span> {prospect.phone}</p></div>}
                        {prospect.revenueRange && <div className="flex items-start gap-2"><DollarIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><p><span className="font-semibold text-gray-300">Faturamento:</span> {prospect.revenueRange}</p></div>}
                        {prospect.segment && <div className="flex items-start gap-2"><TagIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><p><span className="font-semibold text-gray-300">Segmento:</span> {prospect.segment}</p></div>}
                        {prospect.mainActivity && <div className="flex items-start gap-2"><BuildingOfficeIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><p><span className="font-semibold text-gray-300">Atividade:</span> {prospect.mainActivity}</p></div>}
                        {prospect.address && <div className="flex items-start gap-2"><LocationIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" /><p><span className="font-semibold text-gray-300">Endereço:</span> {prospect.address}</p></div>}
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-gray-400">CONTATOS-CHAVE E CONEXÕES</h4>
                            {onFindMoreContacts && (
                                <button onClick={onFindMoreContacts} disabled={isFindingContacts} className="flex items-center gap-1 text-xs bg-sky-800/70 hover:bg-sky-700 text-sky-300 px-2 py-1 rounded-md transition-colors disabled:bg-gray-600 disabled:text-gray-400">
                                {isFindingContacts ? <LoadingSpinner className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
                                {isFindingContacts ? 'Buscando...' : 'Buscar mais'}
                                </button>
                            )}
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {(prospect.partners && prospect.partners.length > 0) ? prospect.partners.map((partner, index) => (
                            <div key={index} className="text-sm bg-gray-800/50 rounded-md p-3">
                                <div className="flex justify-between items-center">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 font-semibold text-gray-200">
                                    <UserCircleIcon className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                    <p>{partner.name} <span className="text-gray-400 font-normal">({partner.qualification})</span></p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 pl-6 text-xs">
                                        {partner.email && (
                                        <div className="flex items-center gap-1 text-gray-300">
                                            <EmailIcon className="w-3 h-3 text-gray-500" />
                                            <a href={`mailto:${partner.email}`} className="hover:text-sky-400">{partner.email}</a>
                                        </div>
                                        )}
                                        {partner.phone && (
                                        <div className="flex items-center gap-1 text-gray-300">
                                            <PhoneIcon className="w-3 h-3 text-gray-500" />
                                            <span>{partner.phone}</span>
                                        </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    {partner.linkedinProfileUrl && (
                                    <a href={partner.linkedinProfileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300" aria-label={`Perfil de ${partner.name} no LinkedIn`}>
                                        <LinkedInIcon className="w-5 h-5"/>
                                    </a>
                                    )}
                                    {(partner.deepAnalysis || partner.connectionPoints || partner.actionPlan) && (
                                        <button onClick={() => handleTogglePartner(index)} aria-expanded={openPartnerIndex === index} aria-controls={`partner-details-${index}`} className="p-1 rounded-full hover:bg-gray-700">
                                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openPartnerIndex === index ? 'rotate-180' : ''}`} />
                                        </button>
                                    )}
                                </div>
                                </div>

                                <div id={`partner-details-${index}`} className={`transition-all duration-300 ease-in-out grid ${openPartnerIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="pl-6 mt-3 space-y-3 border-t border-gray-700/50 pt-3">
                                    {(partner.headline || partner.deepAnalysis) && (
                                        <div>
                                            <h5 className="flex items-center gap-2 text-gray-400 font-semibold mb-2 text-xs"><LinkedInIcon className="w-3.5 h-3.5 text-blue-400" /> Inteligência do LinkedIn</h5>
                                            <div className="pl-5 mt-1 space-y-2 text-xs">
                                            {partner.headline && <p className="text-gray-300 italic">"{partner.headline}"</p>}
                                            {partner.deepAnalysis && <div className="flex items-start gap-2 text-gray-400"><LightbulbIcon className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0"/><p>{partner.deepAnalysis}</p></div>}
                                            {partner.connectionPoints?.length > 0 && <div className="flex items-start gap-2 text-gray-400"><LinkIcon className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" /><div><strong className="text-gray-300">Pontos de Conexão:</strong> {partner.connectionPoints.join(', ')}</div></div>}
                                            {partner.actionPlan && <div className="flex items-start gap-2 text-gray-400"><ClipboardListIcon className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" /><div><strong className="text-gray-300">Plano de Ação:</strong> {partner.actionPlan}</div></div>}
                                            </div>
                                        </div>
                                    )}
                                    {partner.linkedCompanies && partner.linkedCompanies.length > 0 && (
                                        <div className="pt-2 mt-2 border-t border-gray-700">
                                        <div className="flex items-center gap-2 text-gray-400 font-semibold text-xs"><BriefcaseIcon className="w-3.5 h-3.5" /><span>Outras Empresas Vinculadas</span></div>
                                        <div className="pl-5 mt-1 space-y-1 text-xs">{partner.linkedCompanies.map((c, i) => <p key={i} className="text-gray-300">{c.name} {c.role && <span className="text-gray-500">- {c.role}</span>}</p>)}</div>
                                        </div>
                                    )}
                                    </div>
                                </div>
                                </div>
                            </div>
                            )) : (
                            <p className="text-sm text-gray-500">Nenhum contato encontrado.</p>
                            )}
                        </div>
                    </div>

                    {(prospect.qsa || prospect.directors || prospect.corporateHistory) && (
                        <div className="md:col-span-2 border-t border-gray-600 pt-4">
                            <h4 className="text-sm font-semibold text-gray-400 mb-3">INVESTIGAÇÃO CORPORATIVA</h4>
                            <div className="space-y-3 text-sm">
                                {prospect.qsa && prospect.qsa.length > 0 && (
                                    <div className="bg-gray-800/50 p-3 rounded-md">
                                        <p className="font-semibold text-gray-300 mb-2">Quadro Societário (QSA)</p>
                                        <ul className="space-y-1 text-gray-400">
                                            {prospect.qsa.map((item, i) => (
                                                <li key={i}><strong>{item.name}</strong> - {item.qualification} {item.share && `(${item.share})`}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {prospect.directors && prospect.directors.length > 0 && (
                                    <div className="bg-gray-800/50 p-3 rounded-md">
                                        <p className="font-semibold text-gray-300 mb-2">Diretoria</p>
                                        <ul className="space-y-1 text-gray-400">
                                            {prospect.directors.map((item, i) => (
                                                <li key={i}><strong>{item.name}</strong> - {item.position}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {prospect.corporateHistory && (
                                    <div className="bg-gray-800/50 p-3 rounded-md">
                                        <p className="font-semibold text-gray-300 mb-2">Histórico Societário</p>
                                        <p className="text-gray-400 text-xs italic">{prospect.corporateHistory}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    </div>
                    
                    {(prospect.potentialClients || prospect.conversionProbability || (prospect as SavedProspect).qualificationAnalysis) && (
                    <div className="md:col-span-2 border-t border-gray-600 mt-4 pt-4">
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">INTELIGÊNCIA DE VENDAS</h4>
                        <div className="space-y-3 text-sm">
                            {prospect.conversionProbability && (
                                <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-md">
                                    <StarIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"/>
                                    <div>
                                        <p className="font-semibold text-gray-300">Probabilidade de Conversão: <span className={`font-bold ${probabilityStyles[prospect.conversionProbability.score]}`}>{prospect.conversionProbability.score}</span></p>
                                        <p className="text-gray-400">{prospect.conversionProbability.justification}</p>
                                    </div>
                                </div>
                            )}
                            {(prospect as SavedProspect).qualificationAnalysis && (
                            <div className="bg-gray-800/50 p-3 rounded-md">
                                <h5 className="flex items-center gap-2 text-gray-300 font-semibold mb-3">
                                <CheckBadgeIcon className="w-5 h-5 text-teal-400"/> Análise de Qualificação (BANT)
                                </h5>
                                <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                        <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-white font-bold ${qualificationStatusStyles[(prospect as SavedProspect).qualificationAnalysis!.status]}`}>
                                            <span className="text-2xl">{(prospect as SavedProspect).qualificationAnalysis!.score}</span>
                                            <span className="text-xs">{(prospect as SavedProspect).qualificationAnalysis!.status}</span>
                                        </div>
                                    </div>
                                <div className="flex-grow">
                                        <p className="font-semibold text-gray-300">Resumo da Qualificação</p>
                                        <p className="text-gray-400 text-xs">{(prospect as SavedProspect).qualificationAnalysis!.summary}</p>
                                </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                                <div className="bg-gray-900/50 p-2 rounded">
                                    <p className="font-bold text-gray-400">Orçamento:</p>
                                    <p className="text-gray-300">{(prospect as SavedProspect).qualificationAnalysis!.budget.analysis}</p>
                                </div>
                                <div className="bg-gray-900/50 p-2 rounded">
                                    <p className="font-bold text-gray-400">Autoridade:</p>
                                    <p className="text-gray-300">{(prospect as SavedProspect).qualificationAnalysis!.authority.analysis}</p>
                                </div>
                                <div className="bg-gray-900/50 p-2 rounded">
                                    <p className="font-bold text-gray-400">Necessidade:</p>
                                    <p className="text-gray-300">{(prospect as SavedProspect).qualificationAnalysis!.need.analysis}</p>
                                </div>
                                <div className="bg-gray-900/50 p-2 rounded">
                                    <p className="font-bold text-gray-400">Prazo:</p>
                                    <p className="text-gray-300">{(prospect as SavedProspect).qualificationAnalysis!.timeline.analysis}</p>
                                </div>
                                </div>
                            </div>
                            )}
                            {(prospect.potentialClients && prospect.potentialClients.length > 0) && (
                                <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-md">
                                    <UsersIcon className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0"/>
                                    <div>
                                        <p className="font-semibold text-gray-300">Clientes Potenciais (Inferido)</p>
                                        <ul className="list-disc list-inside mt-1 text-gray-400">
                                            {prospect.potentialClients.map((client, i) => (
                                                <li key={i}><strong>{client.clientName}:</strong> {client.reason}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    )}


                    {(prospect.recentNews || prospect.swotAnalysis) && (
                    <div className="md:col-span-2 border-t border-gray-600 mt-4 pt-4">
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">INTELIGÊNCIA ESTRATÉGICA DA EMPRESA</h4>
                        <div className="space-y-3 text-sm">
                        {prospect.recentNews && <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-md"><NewspaperIcon className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0"/><div><p className="font-semibold text-gray-300">Notícias Recentes</p><p className="text-gray-400">{prospect.recentNews}</p></div></div>}
                        {prospect.swotAnalysis && <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-md"><AcademicCapIcon className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0"/><div><p className="font-semibold text-gray-300">Análise SWOT (Inferida)</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs text-gray-400">{prospect.swotAnalysis.strengths?.length > 0 && <div><strong className="text-green-400">Forças:</strong> {prospect.swotAnalysis.strengths.join(', ')}</div>}{prospect.swotAnalysis.weaknesses?.length > 0 && <div><strong className="text-red-400">Fraquezas:</strong> {prospect.swotAnalysis.weaknesses.join(', ')}</div>}{prospect.swotAnalysis.opportunities?.length > 0 && <div><strong className="text-blue-400">Oportunidades:</strong> {prospect.swotAnalysis.opportunities.join(', ')}</div>}{prospect.swotAnalysis.threats?.length > 0 && <div><strong className="text-purple-400">Ameaças:</strong> {prospect.swotAnalysis.threats.join(', ')}</div>}</div></div></div>}
                        </div>
                    </div>
                    )}
                </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default ProspectCard;
