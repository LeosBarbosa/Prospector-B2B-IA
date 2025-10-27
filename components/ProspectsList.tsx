import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import ProspectCard from './ProspectCard';

type SortOrder = 'newest' | 'oldest' | 'alphaAZ' | 'alphaZA' | 'probability';

interface ProspectsListProps {
  searchTerm: string;
  sortOrder: SortOrder;
  selectedSegment: string;
}

const ProspectsList: React.FC<ProspectsListProps> = ({ searchTerm, sortOrder, selectedSegment }) => {
  const { savedProspects, removeProspect, findMoreContacts, isFindingContactsId, updateProspect } = useApp();

  const filteredAndSortedProspects = useMemo(() => {
    let filtered = savedProspects;

    if (selectedSegment) {
        filtered = filtered.filter(p => p.segment === selectedSegment);
    }

    if (searchTerm.trim()){
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(lowercasedFilter) ||
          (p.tradeName && p.tradeName.toLowerCase().includes(lowercasedFilter)) ||
          (p.cnpj && p.cnpj.includes(searchTerm))
        );
    }
    
    const probabilityScore = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };

    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'probability':
            const scoreA = probabilityScore[a.conversionProbability?.score || 'Baixa'] || 0;
            const scoreB = probabilityScore[b.conversionProbability?.score || 'Baixa'] || 0;
            if (scoreB !== scoreA) return scoreB - scoreA;
            return (a.tradeName || a.name).localeCompare(b.tradeName || a.name);
        case 'newest':
            return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        case 'oldest':
            return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
        case 'alphaZA':
            return (b.tradeName || b.name).localeCompare(a.tradeName || a.name);
        case 'alphaAZ':
        default:
            return (a.tradeName || a.name).localeCompare(b.tradeName || a.name);
      }
    });
  }, [savedProspects, searchTerm, sortOrder, selectedSegment]);
  
  return (
    <div className="space-y-4">
      {filteredAndSortedProspects.length > 0 ? (
        filteredAndSortedProspects.map(prospect => (
          <ProspectCard
            key={prospect.id}
            prospect={prospect}
            onRemove={() => removeProspect(prospect.id)}
            onFindMoreContacts={() => findMoreContacts(prospect.id, 'prospect')}
            isFindingContacts={isFindingContactsId === prospect.id}
            onUpdate={updateProspect}
          />
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>Nenhum prospect salvo corresponde à sua busca ou filtro.</p>
          <p className="text-sm">Salve um prospect da aba "Suspects" para começar.</p>
        </div>
      )}
    </div>
  );
};

export default ProspectsList;
