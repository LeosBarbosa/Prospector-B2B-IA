import React, { useState } from 'react';
import FilterSidebar from './FilterSidebar.tsx';
import ProspectsList from './ProspectsList.tsx';
import ProspectDetailView from './ProspectDetailView.tsx';
import { mockProspects } from '../utils/defaultSession.ts';
import { Prospect } from '../types.ts';

const ProspectingView: React.FC = () => {
    const [prospects] = useState<Prospect[]>(mockProspects);
    const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(prospects[0] || null);
    const [isFilterVisible, setIsFilterVisible] = useState(true);

    return (
        <div className="flex h-full bg-white">
            <FilterSidebar 
                isVisible={isFilterVisible}
                toggleVisibility={() => setIsFilterVisible(prev => !prev)}
            />
            <ProspectsList 
                prospects={prospects}
                selectedProspect={selectedProspect}
                onSelectProspect={setSelectedProspect}
            />
            <ProspectDetailView prospect={selectedProspect} />
        </div>
    );
};

export default ProspectingView;