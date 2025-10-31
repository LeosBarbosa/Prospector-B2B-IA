import React from 'react';
import { Prospect } from '../types.ts';
import { PlusIcon, StarIcon, PhoneIcon, MailIcon, CheckCircleIcon, XCircleIcon, LinkedinIcon, BriefcaseIcon, BuildingLibraryIcon, UserGroupIcon, CurrencyDollarIcon, StarIcon as StarIconSolid } from './icons/Icons.tsx';

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="bg-white border border-border-color rounded-lg p-3">
        <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
            {icon}
            <span>{label}</span>
        </div>
        <p className="font-bold text-md text-text-dark">{value}</p>
    </div>
);

const CollaboratorRow: React.FC<{ person: { name: string; role: string; linkedin: string; } }> = ({ person }) => (
    <tr className="border-b border-border-color">
        <td className="py-3 px-2">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </div>
                <span className="font-semibold text-sm">{person.name}</span>
            </div>
        </td>
        <td className="py-3 px-2 text-sm text-text-muted">{person.role}</td>
        <td className="py-3 px-2 text-sm text-text-muted"><a href={person.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline"><LinkedinIcon className="w-5 h-5"/></a></td>
        <td className="py-3 px-2"><button className="px-3 py-1 text-xs font-semibold border border-border-color rounded-md hover:bg-gray-100">Ver perfil</button></td>
    </tr>
);

const ProspectDetailView: React.FC<{ prospect: Prospect | null }> = ({ prospect }) => {
    if (!prospect) {
        return <div className="flex-1 p-6 flex items-center justify-center text-text-muted">Selecione um prospect para ver os detalhes</div>
    }
    
    return (
        <section className="flex-1 overflow-y-auto">
            <header className="p-4 border-b border-border-color sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-text-dark">{prospect.name}</h2>
                        <a href={prospect.website} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">{prospect.website}</a>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm font-semibold border border-border-color rounded-md hover:bg-gray-100">Ligar</button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-color-primary text-white rounded-md hover:bg-color-primary-dark">
                            <PlusIcon className="w-4 h-4"/>
                            Adicionar a uma lista
                        </button>
                    </div>
                </div>
            </header>

            <div className="p-4 grid grid-cols-4 gap-4 bg-gray-50">
                <InfoCard icon={<CurrencyDollarIcon className="w-4 h-4"/>} label="Capital Social" value={prospect.capital || 'N/A'} />
                <InfoCard icon={<UserGroupIcon className="w-4 h-4"/>} label="Qtd. de funcionários" value={prospect.numberOfEmployees || 'N/A'} />
                <InfoCard icon={<BriefcaseIcon className="w-4 h-4"/>} label="Porte" value={prospect.segment || 'N/A'} />
                <div className="bg-white border border-border-color rounded-lg p-3">
                     <div className="flex items-center gap-2 text-text-muted text-xs mb-1"><StarIcon className="w-4 h-4"/><span>Popularidade</span></div>
                     <div className="flex items-center">
                        {[...Array(5)].map((_, i) => <StarIconSolid key={i} className={`w-5 h-5 ${i < prospect.popularity ? 'text-yellow-400' : 'text-gray-300'}`}/>)}
                    </div>
                </div>
                <InfoCard icon={<BuildingLibraryIcon className="w-4 h-4"/>} label="Faturamento presumido" value={prospect.revenueRange || 'N/A'} />
            </div>

            <div className="p-4 grid grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-2">Telefones</h3>
                    <div className="space-y-2">
                        {prospect.phones.map((phone, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-2 border border-border-color rounded-md text-sm">
                                <span>{phone}</span>
                                <div className="flex gap-2">
                                    <button className="p-1 hover:bg-gray-100 rounded-full"><PhoneIcon className="w-4 h-4 text-text-muted"/></button>
                                    <button className="px-3 py-1 text-xs font-semibold border border-border-color rounded-md hover:bg-gray-100">Ligar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Emails</h3>
                     <div className="space-y-2">
                        {prospect.emails.map((email, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-2 border border-border-color rounded-md text-sm">
                                <div className="flex items-center gap-2">
                                    {email.validated ? <CheckCircleIcon className="w-4 h-4 text-green-500"/> : <XCircleIcon className="w-4 h-4 text-red-500"/>}
                                    <span>{email.email}</span>
                                </div>
                                <button className="p-1 hover:bg-gray-100 rounded-full"><MailIcon className="w-4 h-4 text-text-muted"/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4">
                 <h3 className="font-semibold mb-2">Colaboradores</h3>
                 <div className="bg-white border border-border-color rounded-lg">
                    <table className="w-full">
                        <tbody>
                            {prospect.collaborators.map((person, i) => <CollaboratorRow key={i} person={person} />)}
                        </tbody>
                    </table>
                 </div>
            </div>
        </section>
    );
};

export default ProspectDetailView;
