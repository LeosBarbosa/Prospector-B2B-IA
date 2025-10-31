import React, { useState } from 'react';
import { CheckIcon } from './icons/Icons.tsx';

const PlanCard: React.FC<{
    name: string;
    description: string;
    price: string;
    features: string[];
    isPopular?: boolean;
}> = ({ name, description, price, features, isPopular }) => {
    return (
        <div className={`border rounded-lg p-6 flex flex-col ${isPopular ? 'border-color-primary border-2' : 'border-border-color'}`}>
            {isPopular && <span className="text-xs font-bold bg-color-primary text-white py-1 px-3 rounded-full self-start -mt-9 mb-3">O MAIS POPULAR</span>}
            <h3 className={`font-bold text-xl ${isPopular ? 'text-color-primary' : ''}`}>{name}</h3>
            <p className="text-text-muted text-sm mt-2">{description}</p>
            <div className="my-6">
                <span className="text-4xl font-extrabold">{price}</span>
                <span className="text-text-muted"> /usuário</span>
            </div>
            <ul className="space-y-3 text-sm flex-grow">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <CheckIcon className="w-5 h-5 text-color-primary" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button className={`w-full mt-6 py-3 font-semibold rounded-md ${isPopular ? 'bg-color-primary text-white' : 'bg-gray-100'}`}>
                Assinar agora
            </button>
        </div>
    )
}

const HomeView: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div>
        <section className="bg-color-primary text-white text-center py-12">
            <h1 className="text-4xl font-extrabold">Venda mais com: Automação</h1>
            <p className="mt-2 max-w-2xl mx-auto">Otimize sua estratégia de vendas e marketing, escolha o plano ideal GTM para sua empresa vender todo e melhor.</p>
             <div className="inline-flex bg-white rounded-lg p-1 mt-6">
                <button className={`px-6 py-2 rounded-md text-sm font-semibold ${!isAnnual ? 'bg-gray-200 text-text-dark' : 'text-gray-500'}`} onClick={() => setIsAnnual(false)}>Planos</button>
                <button className={`px-6 py-2 rounded-md text-sm font-semibold ${isAnnual ? 'bg-gray-200 text-text-dark' : 'text-gray-500'}`} onClick={() => setIsAnnual(true)}>Pacotes</button>
            </div>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="flex justify-center items-center gap-4 mb-12">
                <span className="font-semibold">Economize até 15% nos planos anuais</span>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isAnnual} onChange={() => setIsAnnual(!isAnnual)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-color-primary"></div>
                </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <PlanCard name="Essencial" description="Marketing avançado e dados para empreendedores." price={isAnnual ? 'R$ 967,00' : 'R$ 1.137,00'} features={['Com IA integrada', '3 usuários', 'Faturamento mensal']} />
                <PlanCard name="Profissional" description="Para empresas que buscam escalar com go-to-market." price={isAnnual ? 'R$ 1.697,00' : 'R$ 1.997,00'} features={['Com IA integrada', '6 usuários', 'Faturamento mensal']} isPopular />
                <PlanCard name="Avançado" description="Controle estratégico de equipe para empresas." price={isAnnual ? 'R$ 2.997,00' : 'R$ 3.527,00'} features={['Com IA integrada', '8 usuários', 'Faturamento mensal']} />
                <PlanCard name="Enterprise" description="Para empresas com necessidades personalizadas e robustas." price="Vamos conversar" features={['Com IA integrada', 'Usuários ilimitados', 'Suporte premium']} />
            </div>
        </section>
    </div>
  );
};

export default HomeView;
