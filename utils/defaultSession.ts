import { Company, Pipeline, Prospect } from '../types.ts';

export const mockCompanies: Company[] = [
    { id: 1, name: 'Empresa Alpha', cnaes: ['6201-5/01', '6204-0/00'], location: 'São Paulo', state: 'SP' },
    { id: 2, name: 'Beta Soluções', cnaes: ['6202-3/00'], location: 'Rio de Janeiro', state: 'RJ' },
    { id: 3, name: 'Gamma Tech', cnaes: ['6209-1/00'], location: 'Belo Horizonte', state: 'MG' },
    { id: 4, name: 'Delta Inovação', cnaes: ['6311-9/00', '7490-1/04'], location: 'Curitiba', state: 'PR' },
    { id: 5, name: 'Omega Systems', cnaes: ['6201-5/01'], location: 'Porto Alegre', state: 'RS' },
];

export const initialPipelineData: Pipeline = {
    deals: {
        'deal-1': { id: 'deal-1', company: 'Emplavi Realizações', content: 'Negócio de Website', value: 15000 },
        'deal-2': { id: 'deal-2', company: 'Tech Solutions', content: 'Contrato de Suporte', value: 25000 },
        'deal-3': { id: 'deal-3', company: 'Alpha Inovações', content: 'Desenvolvimento App', value: 75000 },
        'deal-4': { id: 'deal-4', company: 'Beta Marketing', content: 'Campanha de Mídia', value: 5000 },
        'deal-5': { id: 'deal-5', company: 'Mercado Central', content: 'Sistema de E-commerce', value: 45000 },
    },
    stages: {
        'stage-1': {
            id: 'stage-1',
            title: 'Recontato',
            dealIds: ['deal-1'],
        },
        'stage-2': {
            id: 'stage-2',
            title: 'Enriquecido',
            dealIds: ['deal-2', 'deal-3'],
        },
        'stage-3': {
            id: 'stage-3',
            title: 'Proposta',
            dealIds: ['deal-4', 'deal-5'],
        },
        'stage-4': {
            id: 'stage-4',
            title: 'Fechado',
            dealIds: [],
        },
    },
    stageOrder: ['stage-1', 'stage-2', 'stage-3', 'stage-4'],
};

export const mockProspects: Prospect[] = [
    {
        id: '1',
        name: 'Emplavi Realizações Imobiliárias Ltda',
        tradeName: 'Emplavi',
        website: 'emplavi.com.br',
        segment: 'Imobiliário',
        capital: '17,7 mi',
        numberOfEmployees: '1001-5000',
        revenueRange: '10M-30M',
        popularity: 4,
        phones: ['+55 61 3245 8400', '+55 61 3245 8450', '+55 61 98102 0023'],
        emails: [
            { email: 'emplavi@emplavi.com.br', validated: true },
            { email: 'tecnologia@emplavi.com.br', validated: true },
            { email: 'emplan@emplavi.com.br', validated: false },
        ],
        collaborators: [
            { name: 'Katia Souza', role: 'Marketing', linkedin: '#'},
            { name: 'Gabriella Santos', role: 'Supervisão', linkedin: '#'},
            { name: 'Jonathan Campos', role: 'Comprador', linkedin: '#'},
        ],
    },
     {
        id: '2',
        name: 'Emplavita Soluções Digitais',
        tradeName: 'Emplavita',
        website: 'emplavita.com.br',
        segment: 'Tecnologia',
        capital: '5,2 mi',
        numberOfEmployees: '51-100',
        revenueRange: '1M-5M',
        popularity: 3,
        phones: ['+55 11 4004 1234'],
        emails: [
            { email: 'contato@emplavita.com.br', validated: true },
        ],
        collaborators: [
            { name: 'Ricardo Oliveira', role: 'Desenvolvedor', linkedin: '#'},
        ],
    },
     {
        id: '3',
        name: 'Emplanit Consultoria',
        tradeName: 'Emplanit',
        website: 'emplanit.com',
        segment: 'Consultoria',
        capital: '800 mil',
        numberOfEmployees: '11-50',
        revenueRange: '500k-1M',
        popularity: 5,
        phones: ['+55 21 3344 5566'],
        emails: [
             { email: 'suporte@emplanit.com', validated: true },
        ],
        collaborators: [
            { name: 'Bianca Rios', role: 'Vendas', linkedin: '#'},
            { name: 'Francisco Fontenele', role: 'Operador de máquinas', linkedin: '#'},
        ],
    }
];
