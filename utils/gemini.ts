
// Fixed file formatting.
import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse, Type } from "@google/genai";
// FIX: Import Prospect type
// FIX: Add file extension to fix module resolution error.
import type { Prospect } from '../types.ts';

let ai: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI => {
    if (!ai) {
        // FIX: Per coding guidelines, API_KEY must be sourced from process.env.API_KEY.
        // The fallback logic with a demo key has been removed.
        // The guidelines state to assume process.env.API_KEY is always available.
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const generateGeminiContent = async (
    params: GenerateContentParameters
): Promise<GenerateContentResponse> => {
    try {
        const gemini = getGeminiClient();
        // Use gemini-2.5-flash as a default if no model is provided, which is suitable for most tasks here.
        const model = params.model || 'gemini-2.5-flash';
        const response = await gemini.models.generateContent({ ...params, model });
        return response;
    } catch (error) {
        console.error("Error generating Gemini content:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
};

const prospectSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Razão Social da empresa" },
        tradeName: { type: Type.STRING, description: "Nome Fantasia da empresa" },
        description: { type: Type.STRING, description: "Descrição concisa do que a empresa faz" },
        website: { type: Type.STRING, description: "URL do site da empresa" },
        cnpj: { type: Type.STRING, description: "CNPJ formatado" },
        phone: { type: Type.STRING, description: "Telefone principal" },
        address: { type: Type.STRING, description: "Endereço completo" },
        segment: { type: Type.STRING, description: "Segmento de mercado, ex: 'Tecnologia', 'Varejo'" },
        mainActivity: { type: Type.STRING, description: "Atividade principal (CNAE)" },
        revenueRange: { type: Type.STRING, description: "Faixa de faturamento anual estimada, ex: 'R$ 1M - R$ 5M'" },
        numberOfEmployees: { type: Type.NUMBER, description: "Número estimado de funcionários" },
        partners: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    qualification: { type: Type.STRING }
                }
            },
            description: "Lista de sócios ou contatos chave"
        },
        conversionProbability: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.STRING, enum: ['Alta', 'Média', 'Baixa'] },
                justification: { type: Type.STRING }
            },
            description: "Análise de probabilidade de conversão"
        }
    }
};

export const createB2BPrompt = (companyIdentifier: string): string => {
  return `
    Você é um especialista em prospecção B2B e análise de mercado.
    Sua tarefa é pesquisar na internet e compilar um dossiê detalhado sobre a empresa a seguir.
    
    Empresa: "${companyIdentifier}"

    Use a ferramenta de busca para encontrar o máximo de informações possível.
    Seja minucioso. Priorize dados do Brasil. Se não encontrar uma informação, retorne um valor nulo para o campo correspondente.

    Responda APENAS com um objeto JSON que corresponda ao schema fornecido.
  `;
};

export const createQualificationPrompt = (prospect: Prospect): string => {
    return `
      Você é um SDR (Sales Development Representative) experiente, especialista em qualificação de leads usando a metodologia BANT (Budget, Authority, Need, Timeline).
      Analise os dados do prospect a seguir e forneça uma análise de qualificação completa.

      **Dados do Prospect:**
      - Nome: ${prospect.tradeName || prospect.name}
      - Segmento: ${prospect.segment}
      - Descrição: ${prospect.description}
      - Faturamento Estimado: ${prospect.revenueRange}
      - Notícias Recentes: ${prospect.recentNews || 'N/A'}
      - Clientes Potenciais (Inferido): ${prospect.potentialClients?.map(c => c.clientName).join(', ') || 'N/A'}

      **Sua Tarefa:**
      Baseado nos dados, infira a qualificação BANT. Seja realista.
      
      **FORMATO DE SAÍDA OBRIGATÓRIO:**
      Responda APENAS com um objeto JSON, dentro de um bloco de código.
      O JSON deve ter a seguinte estrutura:
      {
        "status": "Hot" | "Warm" | "Cold",
        "score": number (de 0 a 100),
        "summary": "string (Um resumo conciso da sua análise de qualificação)",
        "budget": { "analysis": "string (Análise sobre a capacidade financeira do prospect)" },
        "authority": { "analysis": "string (Análise sobre quem seriam os decisores)" },
        "need": { "analysis": "string (Análise sobre a necessidade do prospect para uma solução como a sua)" },
        "timeline": { "analysis": "string (Análise sobre a urgência ou o momento ideal para a abordagem)" }
      }
    `;
};

export const createFindContactsPrompt = (prospect: Prospect, existingContactNames: string[]): string => {
  return `
    Você é um especialista em inteligência de vendas e pesquisa de contatos.
    Sua tarefa é encontrar contatos-chave adicionais para a empresa "${prospect.tradeName || prospect.name}" que ainda não estão na lista.

    **Empresa:** ${prospect.tradeName || prospect.name}
    **Website:** ${prospect.website}
    **Contatos já existentes (NÃO INCLUIR ESTES):** ${existingContactNames.join(', ')}

    **Instruções:**
    1. Pesquise no Google e no LinkedIn por executivos, diretores ou gerentes nas áreas de Vendas, Marketing, TI, Operações ou Finanças da empresa.
    2. Para cada novo contato encontrado, tente obter o nome completo, cargo, e-mail e URL do perfil do LinkedIn.
    3. Foque em contatos que pareçam ser decisores ou influenciadores para a compra de software B2B.

    **FORMATO DE SAÍDA OBRIGATÓRIO:**
    Responda APENAS com um array de objetos JSON, dentro de um bloco de código.
    Se nenhum novo contato for encontrado, retorne um array vazio [].
    O array deve seguir o seguinte schema:
    [
      {
        "name": "string",
        "qualification": "string (Cargo)",
        "email": "string | null",
        "linkedinProfileUrl": "string | null"
      }
    ]
  `;
};


export const createColumnMappingPrompt = (headers: string[]): string => {
    return `
      Você é um assistente de importação de dados inteligente. Sua tarefa é mapear os cabeçalhos de uma planilha fornecida pelo usuário para um schema de dados predefinido.
      
      **Schema de Destino:**
      - name: Razão Social da empresa.
      - tradeName: Nome Fantasia.
      - cnpj: CNPJ da empresa.
      - description: Descrição do que a empresa faz.
      - website: Site da empresa.
      - phone: Telefone geral da empresa.
      - segment: Segmento de mercado.
      - contactName: Nome de um contato na empresa.
      - contactQualification: Cargo do contato.
      - contactEmail: E-mail do contato.
      - contactPhone: Telefone do contato.

      **Cabeçalhos da Planilha do Usuário:**
      ${headers.map(h => `- "${h}"`).join('\n')}

      **Instruções:**
      1. Analise cada cabeçalho da planilha.
      2. Encontre a melhor correspondência no "Schema de Destino". A correspondência pode ser parcial, em outro idioma (português/inglês), ou sinônima (ex: "Cargo" -> "contactQualification", "Empresa" -> "name").
      3. Se um cabeçalho não tiver uma correspondência clara, mapeie-o para \`null\`.

      **FORMATO DE SAÍDA OBRIGATÓRIO:**
      Responda APENAS com um único objeto JSON, dentro de um bloco de código.
      O objeto deve ter os cabeçalhos da planilha como chaves e os campos do schema de destino (ou null) como valores.
      Exemplo de formato:
      {
        "Nome da Empresa": "name",
        "Site": "website",
        "Contato Principal": "contactName",
        "Coluna Irrelevante": null
      }
    `;
};