import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { SavedProspect, LinkedCompany, Partner, CompanyNode } from '../types';
import { BuildingOfficeIcon, UsersIcon, BriefcaseIcon, LinkIcon, UserCircleIcon, LoadingSpinner, InformationCircleIcon } from './icons/Icons';

type Edge = { from: string; to: string; partner: string };

const GroupAnalysisView: React.FC = () => {
    const { savedProspects, investigateAndSaveLinkedCompany, showNotification } = useApp();

    const [focalCompanyId, setFocalCompanyId] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<CompanyNode | null>(null);
    const [focalPartner, setFocalPartner] = useState<Partner | null>(null);
    const [hoveredPartner, setHoveredPartner] = useState<Partner | null>(null);
    const [isInvestigatingId, setIsInvestigatingId] = useState<string | null>(null);

    useEffect(() => {
        if (!focalCompanyId && savedProspects.length > 0) {
            const initialCompanyId = savedProspects[0].id;
            setFocalCompanyId(initialCompanyId);
            const prospect = savedProspects.find(p => p.id === initialCompanyId);
            if (prospect) setSelectedNode({ ...prospect, isSaved: true });
        } else if (focalCompanyId) {
            const currentFocal = savedProspects.find(p => p.id === focalCompanyId);
            if (currentFocal && selectedNode?.id !== currentFocal.id) {
                setSelectedNode({ ...currentFocal, isSaved: true });
            } else if (!currentFocal && savedProspects.length > 0) {
              const newFocalId = savedProspects[0].id;
              setFocalCompanyId(newFocalId);
              const prospect = savedProspects.find(p => p.id === newFocalId);
              if (prospect) setSelectedNode({ ...prospect, isSaved: true });
            }
        }
    }, [savedProspects, focalCompanyId, selectedNode?.id]);

    const masterGraph = useMemo(() => {
        const nodesMap = new Map<string, CompanyNode>();
        const edges: Edge[] = [];

        savedProspects.forEach(prospect => {
            if (!nodesMap.has(prospect.id)) {
                nodesMap.set(prospect.id, { ...prospect, isSaved: true });
            }
            prospect.partners?.forEach(partner => {
                partner.linkedCompanies?.forEach(linked => {
                    const linkedId = linked.cnpj || linked.name;
                    const existingSavedNode = savedProspects.find(p => (p.cnpj && p.cnpj === linked.cnpj) || p.name === linked.name);
                    
                    const targetId = existingSavedNode ? existingSavedNode.id : linkedId;
                    
                    if (existingSavedNode && !nodesMap.has(existingSavedNode.id)) {
                         nodesMap.set(existingSavedNode.id, { ...existingSavedNode, isSaved: true });
                    } else if (!existingSavedNode && !nodesMap.has(linkedId)) {
                        nodesMap.set(linkedId, { ...linked, id: linkedId, isSaved: false });
                    }
                    
                    if (!edges.some(e => (e.from === prospect.id && e.to === targetId) || (e.from === targetId && e.to === prospect.id))) {
                        edges.push({ from: prospect.id, to: targetId, partner: partner.name });
                    }
                });
            });
        });

        for (let i = 0; i < savedProspects.length; i++) {
            for (let j = i + 1; j < savedProspects.length; j++) {
                const prospectA = savedProspects[i];
                const prospectB = savedProspects[j];
                const commonPartners = prospectA.partners?.filter(pA => prospectB.partners?.some(pB => pB.name === pA.name)) || [];
                if (commonPartners.length > 0) {
                    const commonPartnerName = commonPartners[0].name;
                    if (!edges.some(e => (e.from === prospectA.id && e.to === prospectB.id) || (e.from === prospectB.id && e.to === prospectA.id))) {
                        edges.push({ from: prospectA.id, to: prospectB.id, partner: commonPartnerName });
                    }
                }
            }
        }
        return { allNodes: Array.from(nodesMap.values()), allEdges: edges };
    }, [savedProspects]);

    const displayGraph = useMemo(() => {
        if (!focalCompanyId) return { nodes: [], edges: [] };
        if (focalPartner) {
            const partnerName = focalPartner.name;
            const connectedCompanyIds = new Set<string>();
            masterGraph.allEdges.forEach(edge => {
                if (edge.partner === partnerName) {
                    connectedCompanyIds.add(edge.from);
                    connectedCompanyIds.add(edge.to);
                }
            });
            const displayNodes = masterGraph.allNodes.filter(node => connectedCompanyIds.has(node.id));
            const displayEdges = masterGraph.allEdges.filter(e => e.partner === partnerName);
            return { nodes: displayNodes, edges: displayEdges };
        }
        
        const focalCompany = masterGraph.allNodes.find(n => n.id === focalCompanyId);
        if (!focalCompany) return { nodes: [], edges: [] };

        const focalEdges = masterGraph.allEdges.filter(e => e.from === focalCompanyId || e.to === focalCompanyId);
        const connectedNodeIds = new Set(focalEdges.flatMap(e => [e.from, e.to]));
        connectedNodeIds.add(focalCompanyId);

        const displayNodes = masterGraph.allNodes.filter(n => connectedNodeIds.has(n.id));
        return { nodes: displayNodes, edges: focalEdges };
    }, [focalCompanyId, focalPartner, masterGraph]);

     const handleInvestigate = async (company: LinkedCompany) => {
        setIsInvestigatingId(company.cnpj || company.name);
        await investigateAndSaveLinkedCompany(company);
        setIsInvestigatingId(null);
    };

    const renderGraph = () => {
        const width = 800;
        const height = 500;
        const center = { x: width / 2, y: height / 2 };
        const { nodes, edges } = displayGraph;

        if (nodes.length === 0 && savedProspects.length > 0) return <p className="text-gray-500 p-4">Selecione uma empresa para ver suas conexões.</p>;
        if (nodes.length === 0 && savedProspects.length === 0) return <p className="text-gray-500 p-4">Salve um prospect para iniciar a análise.</p>;
        if (nodes.length === 1 && !focalPartner) return <p className="text-gray-500 p-4">Nenhuma conexão encontrada para esta empresa.</p>;

        const nodePositions = new Map<string, { x: number, y: number }>();
        const radius = Math.min(width, height) / 2.5;

        if (focalPartner) {
            nodes.forEach((node, i) => {
                const angle = (i / nodes.length) * 2 * Math.PI;
                nodePositions.set(node.id, {
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle),
                });
            });
        } else {
            const focalNode = nodes.find(n => n.id === focalCompanyId);
            const connectedNodes = nodes.filter(n => n.id !== focalCompanyId);
            if (focalNode) nodePositions.set(focalNode.id, center);
            connectedNodes.forEach((node, i) => {
                const angle = (i / connectedNodes.length) * 2 * Math.PI;
                nodePositions.set(node.id, {
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle),
                });
            });
        }

        const isConnectedByHighlight = (nodeId: string) => {
            if (!hoveredPartner) return true;
            const partnerName = hoveredPartner.name;
            if (masterGraph.allEdges.some(e => (e.from === nodeId || e.to === nodeId) && e.partner === partnerName)) {
                return true;
            }
            return false;
        };

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {edges.map((edge, i) => {
                    const fromPos = nodePositions.get(edge.from) || (focalPartner ? center : undefined);
                    const toPos = nodePositions.get(edge.to) || (focalPartner ? center : undefined);
                    if (!fromPos || !toPos) return null;
                    const isHighlighted = !hoveredPartner || edge.partner === hoveredPartner.name;
                    return (
                        <g key={i} opacity={isHighlighted ? 1 : 0.2} className="transition-opacity">
                            <line x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y} stroke={isHighlighted ? '#38bdf8' : '#4a5568'} strokeWidth="2" />
                            {!focalPartner && <text x={(fromPos.x + toPos.x) / 2} y={(fromPos.y + toPos.y) / 2} fill="#9ca3af" fontSize="10" textAnchor="middle" dy="-5">{edge.partner}</text>}
                        </g>
                    );
                })}
                {focalPartner && (
                    <g transform={`translate(${center.x}, ${center.y})`} className="cursor-pointer" onClick={() => setFocalPartner(null)}>
                        <circle r="50" fill="#1f2937" stroke="#f59e0b" strokeWidth="3" />
                        <g transform="translate(-16, -28) scale(1.33)"><UserCircleIcon className="text-sky-400 w-8 h-8" /></g>
                        <text fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" dy="12">{focalPartner.name.split(' ')[0]}</text>
                        <text fill="gray" fontSize="10" textAnchor="middle" dy="26">(clique para voltar)</text>
                    </g>
                )}
                {nodes.map(node => {
                    const pos = nodePositions.get(node.id);
                    if (!pos) return null;
                    const isHighlighted = isConnectedByHighlight(node.id);
                    const isFocal = !focalPartner && node.id === focalCompanyId;
                    return (
                        <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`} className="cursor-pointer transition-opacity" opacity={isHighlighted ? 1 : 0.2} onClick={() => setSelectedNode(node)}>
                            <circle r="40" fill={node.isSaved ? '#1e293b' : '#374151'} stroke={isFocal ? '#f59e0b' : selectedNode?.id === node.id ? '#38bdf8' : '#6b7280'} strokeWidth={isFocal ? 4 : 3} />
                            <text fill="white" fontSize="12" textAnchor="middle" dy="4">{(node as SavedProspect).tradeName?.substring(0, 10) || node.name.substring(0, 10)}</text>
                        </g>
                    );
                })}
            </svg>
        );
    };
    
    const getPartnersForNode = (node: CompanyNode | null): Partner[] => {
      if (!node || !node.isSaved) return [];
      const prospect = savedProspects.find(p => p.id === node.id);
      return prospect?.partners || [];
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full mx-auto animate-fade-in flex flex-col lg:flex-row gap-6">
            <div className="flex-grow lg:w-2/3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-sky-400">Análise de Grupo Empresarial</h2>
                    <select
                        value={focalCompanyId || ''}
                        onChange={(e) => { setFocalCompanyId(e.target.value); setFocalPartner(null); }}
                        className="bg-gray-700 border-2 border-gray-600 rounded-md py-2 pl-3 pr-8 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="" disabled>Selecione uma empresa focal</option>
                        {savedProspects.map(p => (<option key={p.id} value={p.id}>{p.tradeName || p.name}</option>))}
                    </select>
                </div>
                <div className="bg-gray-900/50 rounded-lg border border-gray-700 aspect-[16/10] flex items-center justify-center">
                   {renderGraph()}
                </div>
            </div>

            <div className="lg:w-1/3 flex-shrink-0 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-lg text-gray-300 mb-4 h-7">{selectedNode ? 'Detalhes da Empresa' : 'Selecione uma empresa'}</h3>
                {selectedNode ? (
                    <div className="space-y-4 text-sm animate-fade-in">
                        <h4 className="text-xl font-bold text-sky-400">{(selectedNode as SavedProspect).tradeName || selectedNode.name}</h4>
                        {(selectedNode as SavedProspect).segment && <p className="text-gray-400 -mt-2 mb-2">{(selectedNode as SavedProspect).segment}</p>}
                        
                        {!selectedNode.isSaved && (
                            <div className="p-3 bg-yellow-900/50 border border-yellow-700 rounded-md">
                                <p className="text-yellow-300 font-semibold">Empresa Vinculada (Dados Limitados)</p>
                                <button
                                    onClick={() => handleInvestigate(selectedNode as LinkedCompany)}
                                    disabled={isInvestigatingId === (selectedNode.cnpj || selectedNode.name)}
                                    className="w-full mt-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-500"
                                >
                                    {isInvestigatingId === (selectedNode.cnpj || selectedNode.name) ? <><LoadingSpinner/> Investigando...</> : "Analisar e Salvar como Prospect"}
                                </button>
                            </div>
                        )}
                        
                        <div className="bg-gray-800 p-3 rounded-md space-y-2">
                            {selectedNode.cnpj && <p><span className="font-semibold text-gray-300">CNPJ:</span> {selectedNode.cnpj}</p>}
                            <div className="flex items-start gap-3">
                                <UsersIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                                <p><span className="font-semibold text-gray-300">Funcionários:</span> Aprox. {selectedNode.numberOfEmployees || 'N/A'}</p>
                            </div>
                            <div className="flex items-start gap-3 mt-2">
                                <BriefcaseIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray-300">Produtos/Serviços:</span>
                                    {(selectedNode.productsOrServices && selectedNode.productsOrServices.length > 0) ? (
                                        <ul className="list-disc list-inside text-gray-300 mt-1">
                                            {selectedNode.productsOrServices.map((item, index) => <li key={index}>{item}</li>)}
                                        </ul>
                                    ) : (<span className="text-gray-300"> N/A</span>)}
                                </div>
                            </div>
                        </div>

                        {selectedNode.isSaved && (
                            <div>
                                <h5 className="font-semibold text-gray-400 mb-2">Sócios-Chave e Conexões</h5>
                                <div className="space-y-2">
                                   {getPartnersForNode(selectedNode).length > 0 ? getPartnersForNode(selectedNode).map((partner, i) => (
                                     <div 
                                        key={i} 
                                        onMouseEnter={() => setHoveredPartner(partner)}
                                        onMouseLeave={() => setHoveredPartner(null)}
                                        className={`p-2 rounded-md transition-all flex justify-between items-start ${focalPartner?.name === partner.name ? 'bg-sky-800/50' : 'bg-gray-800'}`}
                                     >
                                        <button 
                                            onClick={() => setFocalPartner(focalPartner?.name === partner.name ? null : partner)}
                                            className="text-left flex-grow"
                                        >
                                            <p className="font-semibold flex items-center gap-2"><LinkIcon className="w-4 h-4 text-sky-400"/> {partner.name}</p>
                                            <p className="text-xs text-gray-400 pl-6">{partner.qualification}</p>
                                        </button>
                                        {(partner.deepAnalysis || partner.connectionPoints) && (
                                            <div className="relative group flex-shrink-0">
                                                <InformationCircleIcon className="w-5 h-5 text-gray-500" />
                                                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 border border-gray-600 text-white text-xs rounded-lg p-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    {partner.deepAnalysis && <p><strong>Análise:</strong> {partner.deepAnalysis}</p>}
                                                    {partner.connectionPoints && <p className="mt-2"><strong>Conexões:</strong> {partner.connectionPoints.join(', ')}</p>}
                                                    <div className="absolute bottom-[-5px] right-4 w-3 h-3 bg-gray-900 transform rotate-45"></div>
                                                </div>
                                            </div>
                                        )}
                                     </div>
                                   )) : <p className="text-gray-500 text-xs px-2">Nenhum sócio-chave listado para esta empresa.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 pt-10">
                        <p>Clique em uma empresa no grafo para ver seus detalhes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupAnalysisView;