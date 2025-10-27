import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import ProspectCard from './ProspectCard';
import { Suspect } from '../types';

interface SuspectsListProps {
  searchTerm: string;
  selectedSegment: string;
}

const SuspectsList: React.FC<SuspectsListProps> = ({ searchTerm, selectedSegment }) => {
  const { 
    suspects, removeSuspect, saveProspect, isQualifyingId, qualifyAndSaveSuspect,
    findMoreContacts, isFindingContactsId, setConfirmation, showNotification, updateProspect
  } = useApp();
  
  const filteredSuspects = useMemo(() => {
    let results = [...suspects];

    if (selectedSegment) {
        results = results.filter(p => p.segment === selectedSegment);
    }
    
    if (searchTerm.trim()) {
        const lowercasedFilter = searchTerm.toLowerCase();
        results = results.filter(p =>
            p.name.toLowerCase().includes(lowercasedFilter) ||
            (p.tradeName && p.tradeName.toLowerCase().includes(lowercasedFilter)) ||
            (p.cnpj && p.cnpj.includes(lowercasedFilter))
        );
    }

    results.sort((a, b) => 
      (a.tradeName || a.name).localeCompare(b.tradeName || b.name)
    );

    return results;
  }, [suspects, searchTerm, selectedSegment]);

  const handleSave = (suspectId: string) => {
    const suspectToSave = suspects.find(s => s.id === suspectId);
    if (suspectToSave) {
        saveProspect(suspectToSave);
    }
  };

  const handleRemove = (suspect: Suspect) => {
    setConfirmation({
      title: 'Remover Suspect',
      message: `Tem certeza de que deseja remover "${suspect.tradeName || suspect.name}" da lista de suspects? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        removeSuspect(suspect.id);
        setConfirmation(null);
        showNotification(`"${suspect.tradeName || suspect.name}" foi removido.`, 'info');
      }
    });
  };

  return (
    <>
      {filteredSuspects.length > 0 ? (
        <div className="space-y-4">
          {filteredSuspects.map((suspect) => (
            <ProspectCard 
              key={suspect.id} 
              prospect={suspect} 
              onSave={() => handleSave(suspect.id)}
              onRemove={() => handleRemove(suspect)}
              onQualify={() => qualifyAndSaveSuspect(suspect.id)}
              isQualifying={isQualifyingId === suspect.id}
              onFindMoreContacts={() => findMoreContacts(suspect.id, 'suspect')}
              isFindingContacts={isFindingContactsId === suspect.id}
              onUpdate={updateProspect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>Nenhum suspect encontrado.</p>
          <p className="text-sm">Use a ferramenta de "Pesquisa" para encontrar novos leads.</p>
        </div>
      )}
    </>
  );
};

export default SuspectsList;
