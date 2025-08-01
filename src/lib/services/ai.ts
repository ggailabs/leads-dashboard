import ZAI from 'z-ai-web-dev-sdk';

export interface AIProvider {
  id: string;
  name: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
}

export interface AIAgent {
  id: string;
  name: string;
  systemPrompt: string;
  providerId: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class AIService {
  private providers: Map<string, AIProvider> = new Map();

  async loadProviders() {
    try {
      const response = await fetch('/api/ai-providers');
      const providers = await response.json();
      
      providers.forEach((provider: AIProvider) => {
        this.providers.set(provider.id, provider);
      });
    } catch (error) {
      console.error('Erro ao carregar provedores:', error);
    }
  }

  async generateResponse(
    agent: AIAgent,
    messages: AIMessage[],
    leadName?: string
  ): Promise<string> {
    const provider = this.providers.get(agent.providerId);
    if (!provider) {
      throw new Error('Provedor não encontrado');
    }

    try {
      const zai = await ZAI.create();

      // Personalizar a mensagem com o nome do lead se disponível
      const personalizedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content.replace('{nome}', leadName || 'cliente')
      }));

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: agent.systemPrompt
          },
          ...personalizedMessages
        ],
        temperature: agent.temperature,
        max_tokens: agent.maxTokens,
      });

      return completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
    } catch (error) {
      console.error('Erro ao gerar resposta com IA:', error);
      throw new Error('Erro ao gerar resposta com IA');
    }
  }

  async generateCampaignMessage(
    agent: AIAgent,
    baseMessage: string,
    leadName?: string,
    leadContext?: string
  ): Promise<string> {
    const provider = this.providers.get(agent.providerId);
    if (!provider) {
      throw new Error('Provedor não encontrado');
    }

    try {
      const zai = await ZAI.create();

      const prompt = `
        Você é um assistente de vendas especializado.
        
        Contexto do lead: ${leadContext || 'Lead novo, sem informações adicionais'}
        Nome do lead: ${leadName || 'Cliente'}
        
        Mensagem base a ser personalizada: "${baseMessage}"
        
        Gere uma mensagem personalizada e persuasiva para este lead.
        A mensagem deve:
        1. Ser pessoal e usar o nome do lead
        2. Ser breve e direta
        3. Ter um tom amigável e profissional
        4. Incluir um call-to-action claro
        
        Retorne apenas a mensagem final, sem explicações adicionais.
      `;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: agent.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: agent.temperature,
        max_tokens: agent.maxTokens,
      });

      return completion.choices[0]?.message?.content || baseMessage;
    } catch (error) {
      console.error('Erro ao gerar mensagem de campanha:', error);
      return baseMessage; // Retorna a mensagem original em caso de erro
    }
  }

  async analyzeLeadIntent(message: string, agent: AIAgent): Promise<{
    intent: 'interest' | 'question' | 'complaint' | 'purchase' | 'other';
    confidence: number;
    response: string;
  }> {
    const provider = this.providers.get(agent.providerId);
    if (!provider) {
      throw new Error('Provedor não encontrado');
    }

    try {
      const zai = await ZAI.create();

      const prompt = `
        Analise a seguinte mensagem de um lead e classifique a intenção:
        
        Mensagem: "${message}"
        
        Classifique a intenção como uma das seguintes:
        - interest: Demonstrou interesse em produtos/serviços
        - question: Fez uma pergunta ou dúvida
        - complaint: Reclamação ou problema
        - purchase: Quer comprar ou contratar
        - other: Outro tipo de mensagem
        
        Responda em formato JSON com:
        {
          "intent": "tipo_de_intencao",
          "confidence": 0.95,
          "response": "resposta_sugerida"
        }
      `;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Você é um analisador de intenção de mensagens de clientes. Seja preciso e objetivo.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      
      try {
        const result = JSON.parse(responseText);
        return {
          intent: result.intent || 'other',
          confidence: result.confidence || 0.5,
          response: result.response || 'Entendi. Como posso ajudar?'
        };
      } catch {
        return {
          intent: 'other',
          confidence: 0.5,
          response: 'Entendi. Como posso ajudar?'
        };
      }
    } catch (error) {
      console.error('Erro ao analisar intenção:', error);
      return {
        intent: 'other',
        confidence: 0.5,
        response: 'Entendi. Como posso ajudar?'
      };
    }
  }

  getProvider(id: string): AIProvider | undefined {
    return this.providers.get(id);
  }

  getActiveProviders(): AIProvider[] {
    return Array.from(this.providers.values()).filter(p => p.isActive);
  }
}

export const aiService = new AIService();