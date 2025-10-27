import { Suspect, SavedProspect, Cadence, TaskStatus, TaskType } from '../types';

// Cole o conteúdo do seu arquivo 'prospector-b2b-session.json' aqui dentro para personalizar os dados de inicialização.
export const defaultSessionData: {
  suspects: Suspect[];
  savedProspects: SavedProspect[];
  cadences: Cadence[];
} = {
  suspects: [
    {
      id: 'default-suspect-1',
      name: 'Empresa Exemplo Ltda',
      tradeName: 'Empresa Exemplo',
      description: 'Uma empresa de tecnologia focada em soluções de software para o mercado financeiro.',
      website: 'https://www.exemplo.com.br',
      cnpj: '12.345.678/0001-99',
      segment: 'Fintech',
    }
  ],
  savedProspects: [
    {
      id: 'default-prospect-1',
      name: 'Sankhya Gestão de Negócios',
      tradeName: 'Sankhya',
      description: 'A Sankhya é uma das maiores empresas provedoras de soluções integradas de gestão corporativa (ERP) do Brasil.',
      website: 'https://www.sankhya.com.br/',
      cnpj: '01.770.098/0001-97',
      segment: 'Software de Gestão (ERP)',
      savedAt: '2025-10-23T23:52:48.704Z',
      conversionProbability: {
        score: 'Alta',
        justification: 'Empresa em expansão com necessidade clara de otimização de processos, alinhada com as soluções oferecidas.'
      },
      partners: [
        {
          name: 'Leonardo Soares',
          qualification: 'Desenvolvedor de Software',
          linkedinProfileUrl: 'https://www.linkedin.com/in/leonardosoares'
        },
        {
          name: 'Felipe Calixto',
          qualification: 'Presidente & Fundador',
          linkedinProfileUrl: 'https://www.linkedin.com/in/felipecalixto/'
        }
      ]
    }
  ],
  cadences: [
      {
          id: 'default-cadence-1',
          name: 'Campanha Sankhya Q4',
          prospectIds: ['default-prospect-1'],
          tasksByProspectId: {
              'default-prospect-1': [
                  { id: 'task-1', description: 'Visitar perfil de Leonardo Soares no LinkedIn e interagir com um post recente.', type: TaskType.LINKEDIN, status: TaskStatus.PENDING },
                  { id: 'task-2', description: 'Enviar e-mail de introdução para Leonardo mencionando a interação no LinkedIn.', type: TaskType.EMAIL, status: TaskStatus.PENDING },
              ]
          }
      }
  ]
};
