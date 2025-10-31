export type ActiveView = 'apps' | 'prospecting' | 'pipelines' | 'landing-pages' | 'automation' | 'agents' | 'search' | 'sequence-builder';

export interface Company {
    id: number;
    name: string;
    cnaes: string[];
    location: string;
    state: string;
}

export interface Deal {
    id: string;
    content: string;
    company: string;
    value: number;
}

export interface Stage {
    id: string;
    title: string;
    dealIds: string[];
}

export interface Pipeline {
    deals: { [key: string]: Deal };
    stages: { [key: string]: Stage };
    stageOrder: string[];
}

export interface Partner {
    name: string;
    qualification: string;
    email?: string | null;
    linkedinProfileUrl?: string | null;
}

export interface ConversionProbability {
    score: 'Alta' | 'Média' | 'Baixa';
    justification: string;
}

export interface Prospect {
    id: string;
    name: string;
    tradeName?: string;
    description?: string;
    website?: string;
    cnpj?: string;
    phone?: string;
    address?: string;
    segment?: string;
    mainActivity?: string;
    revenueRange?: string;
    numberOfEmployees?: string;
    partners?: Partner[];
    conversionProbability?: ConversionProbability;
    recentNews?: string;
    potentialClients?: { clientName: string }[];
    socialMedia?: {
        linkedin?: string;
        facebook?: string;
        instagram?: string;
    };
    capital?: string;
    popularity?: number;
    emails: { email: string; validated: boolean }[];
    phones: string[];
    collaborators: { name: string; role: string; linkedin: string }[];
}