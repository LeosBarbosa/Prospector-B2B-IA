import React from 'react';
import { useApp } from '../contexts/AppContext.tsx';
import { ActiveView } from '../types.ts';
// FIX: Add missing 'AppsIcon' to the import list.
import { 
    ProspectingIcon, CrmIcon, LandingPagesIcon, AutomationIcon, SegmentIcon, UserGuideIcon, AgentsIcon,
    MyWorkIcon, EmailBoxIcon, UserConfigIcon, DigitalPhoneIcon, WhatsappIcon, MeetIcon, ClientsIcon,
    DocumentsIcon, ProductsIcon, AgendaIcon, ActivitiesIcon, ContactsIcon, EmailModelsIcon, CallScriptIcon,
    CampaignsIcon, IntegrationsIcon, SettingsIcon, DashboardsIcon, StrategyIcon, ProgramIcon, FormsIcon,
    PortalsIcon, ReportsIcon, MeetingsIcon, ChevronDownIcon, SearchIconOutline, AppsIcon
} from './icons/Icons.tsx';

interface AppCardProps {
    view: ActiveView | null;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const AppCard: React.FC<AppCardProps> = ({ view, label, icon, color }) => {
    const { setActiveView } = useApp();
    const bgColor = `bg-${color}-100`;
    const textColor = `text-${color}-600`;

    const handleClick = () => {
        if (view) {
            setActiveView(view);
        }
    };

    return (
        <div onClick={handleClick} className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center`} style={{backgroundColor: color+'20'}}>
                 <div style={{color: color}}>{icon}</div>
            </div>
            <span className="text-xs font-semibold mt-2 text-text-dark">{label}</span>
        </div>
    );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
    return (
        <details className="mb-6" open={defaultOpen}>
            <summary className="flex items-center gap-3 cursor-pointer list-none">
                <div className="text-color-accent">{icon}</div>
                <h2 className="text-lg font-bold">{title}</h2>
                <ChevronDownIcon className="w-5 h-5 text-text-muted" />
            </summary>
            <div className="pt-4">
                {children}
            </div>
        </details>
    )
}

const appsRecommended: AppCardProps[] = [
    { view: 'prospecting', label: 'Prospecção', icon: <ProspectingIcon className="w-7 h-7" />, color: '#3B82F6'},
    { view: 'pipelines', label: 'CRM', icon: <CrmIcon className="w-7 h-7" />, color: '#A855F7'},
    { view: 'landing-pages', label: 'Landing Pages', icon: <LandingPagesIcon className="w-7 h-7" />, color: '#EF4444'},
    { view: 'automation', label: 'Automação', icon: <AutomationIcon className="w-7 h-7" />, color: '#84CC16'},
    { view: null, label: 'Segmento Alvo', icon: <SegmentIcon className="w-7 h-7" />, color: '#EC4899'},
    { view: null, label: 'Guia do usuário', icon: <UserGuideIcon className="w-7 h-7" />, color: '#10B981'},
    { view: 'agents', label: 'Agentes de IA', icon: <AgentsIcon className="w-7 h-7" />, color: '#6366F1'},
];

const allApps: AppCardProps[] = [
     { view: null, label: 'Meu trabalho', icon: <MyWorkIcon className="w-7 h-7" />, color: '#10B981'},
     { view: null, label: 'Caixa de Email', icon: <EmailBoxIcon className="w-7 h-7" />, color: '#F97316'},
     { view: null, label: 'Configurar usuários', icon: <UserConfigIcon className="w-7 h-7" />, color: '#3B82F6'},
     { view: null, label: 'Telefone Digital', icon: <DigitalPhoneIcon className="w-7 h-7" />, color: '#14B8A6'},
     { view: null, label: 'Whatsapp', icon: <WhatsappIcon className="w-7 h-7" />, color: '#22C55E'},
     { view: null, label: 'Meet', icon: <MeetIcon className="w-7 h-7" />, color: '#EC4899'},
     { view: null, label: 'Clientes', icon: <ClientsIcon className="w-7 h-7" />, color: '#A855F7'},
     { view: null, label: 'Documentos', icon: <DocumentsIcon className="w-7 h-7" />, color: '#0EA5E9'},
     { view: null, label: 'Produtos', icon: <ProductsIcon className="w-7 h-7" />, color: '#D946EF'},
     { view: null, label: 'Agenda', icon: <AgendaIcon className="w-7 h-7" />, color: '#EF4444'},
     { view: null, label: 'Atividades', icon: <ActivitiesIcon className="w-7 h-7" />, color: '#A855F7'},
     { view: null, label: 'Ext. de Contatos', icon: <ContactsIcon className="w-7 h-7" />, color: '#6366F1'},
     { view: null, label: 'Modelos de email', icon: <EmailModelsIcon className="w-7 h-7" />, color: '#EC4899'},
     { view: null, label: 'Caixa de Saída', icon: <CallScriptIcon className="w-7 h-7" />, color: '#F59E0B'},
     { view: null, label: 'Campanhas', icon: <CampaignsIcon className="w-7 h-7" />, color: '#84CC16'},
     { view: null, label: 'Integrações', icon: <IntegrationsIcon className="w-7 h-7" />, color: '#10B981'},
     { view: null, label: 'Configurações', icon: <SettingsIcon className="w-7 h-7" />, color: '#EC4899'},
     { view: null, label: 'Dashboards', icon: <DashboardsIcon className="w-7 h-7" />, color: '#0EA5E9'},
     { view: null, label: 'Painel estratégico', icon: <StrategyIcon className="w-7 h-7" />, color: '#A855F7'},
     { view: null, label: 'Programa de indicação', icon: <ProgramIcon className="w-7 h-7" />, color: '#EF4444'},
     { view: null, label: 'Formulários', icon: <FormsIcon className="w-7 h-7" />, color: '#14B8A6'},
     { view: null, label: 'Portais', icon: <PortalsIcon className="w-7 h-7" />, color: '#F97316'},
     { view: null, label: 'Relatórios', icon: <ReportsIcon className="w-7 h-7" />, color: '#3B82F6'},
     { view: null, label: 'Reuniões', icon: <MeetingsIcon className="w-7 h-7" />, color: '#6366F1'},
]

const AppsView: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">11:20</h1>
                        <p className="text-text-muted">31 de outubro, Sexta-feira, 2025</p>
                    </div>
                     <div className="flex gap-4">
                        <div className="bg-orange-100 text-orange-600 p-3 rounded-lg text-sm font-semibold">Aulas de teste restantes, assine agora</div>
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg text-sm font-semibold flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.214 2.273-1.483 3.488-.595l.024.018 4.234 2.448c1.214.701 1.63 2.373.93 3.587l-.019.025-2.448 4.234c-.701 1.214-2.373 1.63-3.587.93l-.025-.019-4.234-2.448a3.099 3.099 0 01-.93-3.587l.019-.025 2.448-4.234zM9.998 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" /></svg>
                           Existe uma versão mais nova do sistema.
                        </div>
                    </div>
                </div>
                 <div className="mt-6 relative">
                    <SearchIconOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Buscar leads, negócios, contatos..." className="w-full bg-white border border-border-color rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-color-primary focus:outline-none"/>
                </div>
            </header>
            
            <main>
                <Section title="Personalizado por inteligência artificial" icon={<AgentsIcon className="w-6 h-6"/>} defaultOpen>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-color-primary text-white p-6 rounded-2xl col-span-1 md:col-span-2">
                            <h3 className="font-bold text-lg">Fale com seu agente</h3>
                            <p className="text-sm opacity-90 mb-6">Veja o agente em ação</p>
                            <div className="flex gap-4">
                                <button className="bg-white text-color-primary font-semibold px-6 py-2 rounded-lg">Testar no WhatsApp</button>
                                <button className="bg-white/30 text-white font-semibold px-6 py-2 rounded-lg">Chat</button>
                            </div>
                        </div>
                        <div className="bg-white border border-border-color p-6 rounded-2xl">
                             <h3 className="font-bold text-lg">Agentes de IA para Vendas</h3>
                             <p className="text-sm text-text-muted mb-6">1 agente salvo</p>
                             <button className="w-full border border-border-color font-semibold px-6 py-2 rounded-lg text-sm">Configurar</button>
                        </div>
                     </div>
                </Section>
                <Section title="Recomendados" icon={<MyWorkIcon className="w-6 h-6"/>} defaultOpen>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-4">
                        {appsRecommended.map(app => <AppCard key={app.label} {...app} />)}
                    </div>
                </Section>
                 <Section title="Todos os Aplicativos Leads2b" icon={<AppsIcon className="w-6 h-6"/>} defaultOpen>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-4">
                        {allApps.map(app => <AppCard key={app.label} {...app} />)}
                    </div>
                </Section>

            </main>
        </div>
    );
};

export default AppsView;