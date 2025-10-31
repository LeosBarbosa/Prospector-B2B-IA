import React from 'react';
import { Prospect } from '../types.ts';
import { SearchIconOutline, FacebookIcon, GlobeAltIcon, LinkedinIcon, PhoneIcon, MailIcon, CheckCircleIcon } from './icons/Icons.tsx';

const ProspectCard: React.FC<{ prospect: Prospect; isSelected: boolean; onSelect: () => void; }> = ({ prospect, isSelected, onSelect }) => {
    return (
        <div 
            onClick={onSelect}
            className={`flex items-start p-3 border-b border-border-color cursor-pointer ${isSelected ? 'bg-color-primary/5' : 'hover:bg-gray-50'}`}
        >
            <input type="checkbox" className="mt-1 mr-4" />
            <div className="flex-grow">
                <div className="flex items-center">
                    <span className="font-bold text-sm text-blue-600">{prospect.name}</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-pink-100 text-pink-600 rounded-full font-semibold">{prospect.segment}</span>
                </div>
                <div className="flex items-center gap-4 text-text-muted mt-2">
                    <div className="flex items-center gap-1.5 text-xs">
                        <GlobeAltIcon className="w-4 h-4" /> {prospect.website}
                    </div>
                     <div className="flex items-center gap-1.5 text-xs">
                        <PhoneIcon className="w-4 h-4" /> {prospect.phones[0]}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end text-right ml-4">
                 <div className="flex items-center gap-3 text-text-muted">
                    <FacebookIcon className="w-4 h-4 hover:text-blue-600" />
                    <LinkedinIcon className="w-4 h-4 hover:text-blue-700" />
                </div>
                <div className="flex items-center gap-1.5 text-xs mt-2 text-green-600">
                    <CheckCircleIcon className="w-4 h-4"/>
                    {prospect.emails[0].email}
                </div>
            </div>
        </div>
    );
}

const ProspectsList: React.FC<{
    prospects: Prospect[];
    selectedProspect: Prospect | null;
    onSelectProspect: (prospect: Prospect) => void;
}> = ({ prospects, selectedProspect, onSelectProspect }) => {
    return (
        <section className="w-[500px] border-r border-border-color flex flex-col shrink-0">
            <header className="p-3 border-b border-border-color shrink-0">
                <div className="relative">
                     <SearchIconOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input type="text" placeholder="Pesquisar por nome, empresa..." defaultValue="emplan" className="w-full bg-gray-100 border border-border-color rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-color-primary focus:outline-none"/>
                </div>
            </header>
            <div className="flex items-center justify-between text-xs text-text-muted px-3 py-2 border-b border-border-color bg-gray-50 shrink-0">
                <div className="flex items-center">
                    <input type="checkbox" className="mr-4" />
                    <span>Empresa</span>
                </div>
                <span>Redes sociais e Contatos</span>
            </div>
            <div className="overflow-y-auto flex-grow">
                {prospects.map(p => (
                    <ProspectCard 
                        key={p.id} 
                        prospect={p} 
                        isSelected={selectedProspect?.id === p.id}
                        onSelect={() => onSelectProspect(p)}
                    />
                ))}
            </div>
             <footer className="p-3 border-t border-border-color text-xs text-text-muted flex justify-between items-center shrink-0">
                <span>Exibindo 1-3 de 3</span>
                <div className="flex items-center gap-2">
                    <span>25 por página</span>
                    <button>&lt;</button>
                    <span>1</span>
                    <button>&gt;</button>
                </div>
            </footer>
        </section>
    );
};

export default ProspectsList;
