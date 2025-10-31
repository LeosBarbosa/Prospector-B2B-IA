import React from 'react';
import { ChevronDoubleLeftIcon, ListIcon, SavedIcon } from './icons/Icons.tsx';

const FilterCategory: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <details className="py-2 border-b border-border-color" open>
        <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center py-1">
            {title}
            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </summary>
        <div className="pt-3 pb-2 space-y-3">
            {children}
        </div>
    </details>
);

const FilterSidebar: React.FC<{ isVisible: boolean; toggleVisibility: () => void; }> = ({ isVisible, toggleVisibility }) => {
    if (!isVisible) {
        return (
             <div className="w-12 bg-gray-50 border-r border-border-color flex justify-center pt-4">
                 <button onClick={toggleVisibility} title="Mostrar filtros" className="text-text-muted hover:text-text-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>
                 </button>
             </div>
        )
    }

    return (
        <aside className="w-72 bg-gray-50 border-r border-border-color flex flex-col shrink-0 animate-slide-in-left">
            <header className="flex items-center justify-between h-14 border-b border-border-color px-4 shrink-0">
                <span className="font-semibold text-md">Filtros</span>
                <button onClick={toggleVisibility} title="Ocultar filtros" className="text-text-muted hover:text-text-dark">
                    <ChevronDoubleLeftIcon className="w-5 h-5" />
                </button>
            </header>
            <div className="overflow-y-auto p-4">
                <FilterCategory title="Listas">
                    <button className="w-full flex items-center gap-3 p-2 rounded-md text-sm font-semibold bg-green-100 text-color-primary">
                        <ListIcon className="w-5 h-5" />
                        <span>Minhas Listas</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-text-muted hover:bg-gray-200">
                        <SavedIcon className="w-5 h-5" />
                        <span>Salvos</span>
                    </button>
                </FilterCategory>
                <FilterCategory title="CNAES">
                    <input type="text" placeholder="Buscar CNAE" className="w-full border border-border-color rounded-md px-2 py-1.5 text-sm"/>
                </FilterCategory>
                <FilterCategory title="Localização">
                    <input type="text" placeholder="Cidade" className="w-full border border-border-color rounded-md px-2 py-1.5 text-sm mb-2"/>
                    <input type="text" placeholder="Estado (UF)" className="w-full border border-border-color rounded-md px-2 py-1.5 text-sm"/>
                </FilterCategory>
                 <FilterCategory title="Porte">
                    <select className="w-full border border-border-color rounded-md px-2 py-1.5 text-sm">
                        <option>Qualquer</option>
                        <option>MEI</option>
                        <option>Microempresa</option>
                        <option>Pequeno Porte</option>
                         <option>Demais</option>
                    </select>
                </FilterCategory>
                 <FilterCategory title="Natureza Jurídica">
                    <input type="text" placeholder="Buscar natureza" className="w-full border border-border-color rounded-md px-2 py-1.5 text-sm"/>
                </FilterCategory>
            </div>
        </aside>
    );
};

export default FilterSidebar;
