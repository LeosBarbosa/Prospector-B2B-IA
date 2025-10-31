import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ActiveView } from '../types.ts';

interface AppContextType {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    isNavPinned: boolean;
    setIsNavPinned: (pinned: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeView, setActiveView] = useState<ActiveView>('apps');
    const [isNavPinned, setIsNavPinned] = useState<boolean>(false);

    const value = {
        activeView,
        setActiveView,
        isNavPinned,
        setIsNavPinned,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};