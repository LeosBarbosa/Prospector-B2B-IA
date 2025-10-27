import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/Icons';

interface FilterAccordionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 px-2 text-left text-sm font-semibold text-gray-300 hover:bg-gray-700/50 rounded-md"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="pt-2 pb-4 px-2 space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterAccordion;
