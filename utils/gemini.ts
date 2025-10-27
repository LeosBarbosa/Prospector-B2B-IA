import { GoogleGenAI, GenerateContentRequest } from "@google/genai";
import { Prospect, Partner } from "./types";

let geminiClient: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI => {
  if (!geminiClient) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY do Gemini não encontrada no ambiente.");
    }
    geminiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return geminiClient;
};

export interface B2BFilters {
  aiPrompt?: string;
  jobTitle?: string;
  location?: string;
  industry?: string;
  technologies?: string;
  revenue?: string;
}

export const createB2BPrompt = (query: string, filters: B2BFilters = {}): string => {
  let finalQuery = filters.aiPrompt ? filters.aiPrompt : query;
  
  let filterInstructions = "";
  const appliedFilters: string[] = [];

  if (filters.jobTitle) appliedFilters.push(`- Cargos: ${filters.jobTitle}`);
  if (filters.location) appliedFilters.push(`- Localização: ${filters.location}`);
  if (filters.industry) appliedFilters.push(`- Indústria/Setor: ${filters.industry}`);
  if (filters.technologies) appliedFilters.push(`- Tecnologias Utilizadas: ${filters.technologies}`);
  if (filters.revenue) appliedFilters.push(`- Faixa de Receita (Faturamento): ${filters.revenue}`);


  if (appliedFilters.length > 0) {
    filterInstructions = `
---
**CRITÉRIOS DE FILTRAGEM ADICIONAIS (OBRIGATÓRIO):**
---
Além da busca principal, refine os resultados para que correspondam ESTritamente aos seguintes critérios:
${appliedFilters.join('\n')}
`;
  }

  return `
**DIRETIVA PRINCIPAL: INVESTIGAÇÃO CORPORATIVA SÊNIOR**

**PERSONA:** Você é um Investigador Corporativo Sênior, especializado em inteligência de mercado e análise de risco B2B. Sua missão é realizar uma pesquisa profunda (Deep Research) sobre a empresa informada e produzir um relatório de inteligência completo e validado.

**FOCO ABSOLUTO (NÃO-NEGOCIÁVEL):** A qualidade da investigação é medida pela precisão e profundidade do mapeamento do **Quadro Societário (QSA)** e da **Liderança Executiva**. A obtenção de dados de contato (LinkedIn, e-mail profissional, telefone) é uma diretiva crítica.

---
**ETAPAS DA INVESTIGAÇÃO PROFUNDA:**
---
1.  **IDENTIFICAÇÃO E CADASTRO:**
    *   Valide os dados cadastrais completos (Razão Social, Nome Fantasia, CNPJ, Endereço com CEP).
    *   **QSA (Quadro de Sócios e Administradores):** Detalhe o QSA completo, buscando ativamente por **CPF (se público), cargo e participação societária (%)** para cada sócio.
    *   **Diretoria:** Identifique e liste os diretores e seus respectivos cargos.
    *   **Histórico Societário:** Se disponível, resuma brevemente as últimas alterações societárias.

2.  **MAPEAMENTO DE LIDERANÇA E CONTATOS:**
    *   Para **C-Levels, Diretores e Gerentes Sêniores**, encontre e valide: **nome completo, cargo, URL do perfil no LinkedIn, e-mail profissional e telefone corporativo.**
    *   Para cada perfil do LinkedIn, extraia e analise: 'headline', 'deepAnalysis' (análise do perfil), 'connectionPoints' e um 'actionPlan' para abordagem.

3.  **ANÁLISE DE MERCADO E OPORTUNIDADE (ENRIQUECIMENTO):**
    *   **Inteligência de Vendas:** Identifique 'potentialClients' e calcule a 'conversionProbability' (Alta, Média, Baixa) com justificativa.
    *   **Dados Estratégicos:** Colete 'numberOfEmployees', 'productsOrServices', 'swotAnalysis' e 'recentNews'.

${filterInstructions}

---
**FORMATO DE SAÍDA OBRIGATÓRIO (JSON PURO E VÁLIDO):**
---
A resposta DEVE ser um único objeto JSON ou um array de objetos JSON.
\`\`\`json
{
  "name": "Razão Social Completa",
  "tradeName": "Nome Fantasia",
  "description": "Resumo da empresa.",
  "website": "https://www.site.com.br",
  "phone": "(XX) XXXX-XXXX",
  "cnpj": "XX.XXX.XXX/0001-XX",
  "address": "Endereço completo com CEP",
  "mainActivity": "Atividade principal",
  "revenueRange": "Estimativa de faturamento",
  "segment": "Segmento de mercado",
  "numberOfEmployees": "Estimativa de funcionários",
  "productsOrServices": ["Produto/Serviço 1"],
  "corporateHistory": "Breve resumo do histórico societário, se encontrado.",
  "qsa": [
    { "name": "Nome Sócio A", "qualification": "Sócio-Administrador", "cpf": "XXX.XXX.XXX-XX", "share": "50%" }
  ],
  "directors": [
    { "name": "Nome Diretor A", "position": "Diretor de TI" }
  ],
  "partners": [
    {
      "name": "Nome Completo do Contato",
      "qualification": "Cargo (ex: Diretor de TI)",
      "email": "email.contato@empresa.com",
      "phone": "(XX) XXXXX-XXXX",
      "linkedinProfileUrl": "https://www.linkedin.com/in/perfil",
      "headline": "Headline do LinkedIn",
      "deepAnalysis": "Análise do perfil.",
      "connectionPoints": ["Ponto de conexão 1"],
      "actionPlan": "Plano de ação sugerido.",
      "linkedCompanies": [
        { "name": "Outra Empresa S.A.", "cnpj": "YY.YYY.YYY/0001-YY", "role": "Sócio" }
      ]
    }
  ],
  "conversionProbability": { "score": "Alta", "justification": "Justificativa." },
  "potentialClients": [ { "clientName": "Cliente Exemplo", "reason": "Razão." } ],
  "recentNews": "Notícia recente.",
  "swotAnalysis": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] }
}
\`\`\`

**ALVO DA INVESTIGAÇÃO:** "${finalQuery}"
`;
}

export const createFindContactsPrompt = (prospect: Prospect, existingContactNames: string[]): string => `
**DIRETIVA PRINCIPAL: EXPANSÃO DE REDE E VERIFICAÇÃO DE CONTATOS (DEEP RESEARCH)**

**PERSONA:** Você é um Investigador Corporativo Sênior e Headhunter Digital. Sua missão é realizar uma **pesquisa aprofundada (Deep Research)** para encontrar e, mais importante, **validar** novos executivos de alto valor em uma empresa-alvo. A precisão e autenticidade dos dados são prioridade máxima.

**MISSÃO:**
1.  Analisar a empresa-alvo usando a busca na web para encontrar executivos de nível C, Diretores, Gerentes e Coordenadores.
2.  **VALIDAR CADA PERFIL:** Antes de incluir um contato na resposta, verifique sua autenticidade. Perfis com nomes fictícios ou informações inconsistentes devem ser descartados. Use a busca para cruzar informações e garantir que o perfil do LinkedIn é real e pertence a um profissional ativo na empresa.
3.  Encontrar **NOVOS** contatos, evitando duplicatas.

---
**REGRAS DA BUSCA E VALIDAÇÃO:**
---
1.  **VERACIDADE ACIMA DE TUDO:** A prioridade é a qualidade e a autenticidade dos dados. É melhor retornar menos contatos validados do que muitos contatos imprecisos ou fictícios.
2.  **EVITAR DUPLICATAS:** **NÃO inclua** os seguintes contatos que já foram identificados: ${existingContactNames.join(', ') || 'Nenhum'}.
3.  **DADOS CRÍTICOS E VALIDADOS:** Para cada **NOVO** contato encontrado, é **obrigatório** fornecer:
    *   Nome completo ('name')
    *   Cargo ('qualification')
    *   E-mail profissional verificado ('email')
    *   URL do perfil no LinkedIn autêntico ('linkedinProfileUrl')

---
**DADOS DA EMPRESA-ALVO:**
---
- **Empresa:** ${prospect.name}
- **Segmento:** ${prospect.segment}
- **Website:** ${prospect.website}

---
**FORMATO DE SAÍDA OBRIGATÓRIO (JSON PURO E VÁLIDO):**
---
A resposta DEVE ser um array de objetos JSON, mesmo que esteja vazio.
\`\`\`json
[
  {
    "name": "Nome Completo do Novo Contato Validado",
    "qualification": "Cargo do Novo Contato",
    "email": "email.novo.validado@empresa.com",
    "linkedinProfileUrl": "https://www.linkedin.com/in/perfil-real-e-verificado"
  }
]
\`\`\`
`;

export const createQualificationPrompt = (prospect: Prospect): string => `
**DIRETIVA PRINCIPAL: QUALIFICAÇÃO DE LEAD B2B (FRAMEWORK BANT)**

**PERSONA:** Você é um Sales Development Representative (SDR) de elite, com alta performance, especializado em qualificar leads inbound e outbound para garantir que a equipe de vendas foque apenas nas melhores oportunidades.

**MISSÃO:** Analisar o dossiê da empresa-alvo e realizar uma qualificação completa usando o framework BANT (Budget, Authority, Need, Timeline). O resultado deve ser uma análise objetiva, com score, status e próximos passos recomendados.

---
**DADOS DO PROSPECT PARA ANÁLISE:**
---
- **Empresa:** ${prospect.name} (${prospect.tradeName || ''})
- **Segmento:** ${prospect.segment}
- **Faturamento Estimado:** ${prospect.revenueRange}
- **Nº de Funcionários:** ${prospect.numberOfEmployees}
- **Descrição:** ${prospect.description}
- **Notícias Recentes:** ${prospect.recentNews}
- **Análise SWOT:** ${JSON.stringify(prospect.swotAnalysis)}
- **Contatos-Chave:** ${prospect.partners?.map(p => `${p.name} (${p.qualification})`).join(', ')}

---
**ETAPAS DA QUALIFICAÇÃO (BANT):**
---
1.  **Budget (Orçamento):** Com base no faturamento, segmento e notícias, infira a capacidade financeira da empresa. Ela tem orçamento para soluções como a que seria oferecida?
2.  **Authority (Autoridade):** Os contatos identificados são os tomadores de decisão corretos? Se não, quem deveria ser o alvo?
3.  **Need (Necessidade):** Com base na análise SWOT e na descrição da empresa, identifique um ponto de dor claro que a sua solução poderia resolver. A necessidade é explícita ou latente?
4.  **Timeline (Prazo):** Há algum indicador (notícias de expansão, contratações) que sugira urgência na resolução do problema identificado? Estime um prazo para a decisão de compra.

---
**FORMATO DE SAÍDA OBRIGATÓRIO (JSON PURO E VÁLIDO):**
---
A resposta DEVE ser um único objeto JSON, seguindo ESTRITAMENTE o modelo abaixo.
\`\`\`json
{
  "score": 85,
  "status": "Hot",
  "summary": "Resumo executivo da qualificação e recomendação de próximos passos.",
  "budget": {
    "analysis": "Análise sobre a capacidade de investimento da empresa.",
    "hasBudget": true
  },
  "authority": {
    "analysis": "Análise sobre os contatos identificados e quem detém o poder de decisão.",
    "decisionMakerIdentified": true
  },
  "need": {
    "analysis": "Descrição do principal ponto de dor ou necessidade da empresa.",
    "hasNeed": true
  },
  "timeline": {
    "analysis": "Estimativa do prazo para uma decisão de compra.",
    "isUrgent": false
  }
}
\`\`\`
`;


export const generateGeminiContent = async (
  requestConfig: Omit<GenerateContentRequest, 'model'>
): Promise<any> => {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      ...requestConfig,
      config: {
        temperature: 0.2, 
        topP: 0.9,
        ...requestConfig.config,
      },
    });

    if (!response.text) {
      throw new Error("A IA não retornou conteúdo de texto.");
    }

    return response;
  } catch (error: any) {
    console.error("Erro na chamada da API Gemini:", error);
    throw new Error(error.message || "Falha na comunicação com a IA Gemini.");
  }
};