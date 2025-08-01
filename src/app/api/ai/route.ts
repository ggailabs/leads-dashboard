import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiService } from "@/lib/services/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, leadId, agentId, message, context } = body;

    if (!action || !agentId || !message) {
      return NextResponse.json(
        { error: "Action, agentId e message são obrigatórios" },
        { status: 400 }
      );
    }

    // Carregar provedores de IA
    await aiService.loadProviders();

    switch (action) {
      case "generate_response":
        return await generateResponse(leadId, agentId, message, context);
      
      case "analyze_intent":
        return await analyzeIntent(agentId, message);
      
      case "generate_campaign_message":
        return await generateCampaignMessage(agentId, message, context);
      
      default:
        return NextResponse.json(
          { error: "Ação não suportada" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erro ao processar requisição IA:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

async function generateResponse(leadId: string, agentId: string, message: string, context?: any) {
  try {
    // Buscar informações do agente
    const agent = await db.aIAgent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    // Buscar informações do lead
    const lead = await db.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead não encontrado" },
        { status: 404 }
      );
    }

    // Buscar histórico de mensagens
    const messages = await db.whatsAppMessage.findMany({
      where: { leadId },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    // Formatar mensagens para o formato esperado pela IA
    const formattedMessages = messages.reverse().map(msg => ({
      role: msg.direction === "INCOMING" ? "user" : "assistant",
      content: msg.message,
    }));

    // Adicionar a mensagem atual
    formattedMessages.push({
      role: "user",
      content: message,
    });

    // Gerar resposta com IA
    const response = await aiService.generateResponse(
      agent,
      formattedMessages,
      lead.name
    );

    return NextResponse.json({
      success: true,
      response,
      leadName: lead.name,
      agentName: agent.name,
    });
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    return NextResponse.json(
      { error: "Erro ao gerar resposta" },
      { status: 500 }
    );
  }
}

async function analyzeIntent(agentId: string, message: string) {
  try {
    // Buscar informações do agente
    const agent = await db.aIAgent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    // Analisar intenção da mensagem
    const analysis = await aiService.analyzeLeadIntent(message, agent);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Erro ao analisar intenção:", error);
    return NextResponse.json(
      { error: "Erro ao analisar intenção" },
      { status: 500 }
    );
  }
}

async function generateCampaignMessage(agentId: string, baseMessage: string, context?: any) {
  try {
    // Buscar informações do agente
    const agent = await db.aIAgent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    // Gerar mensagem personalizada
    const personalizedMessage = await aiService.generateCampaignMessage(
      agent,
      baseMessage,
      context?.leadName,
      context?.leadContext
    );

    return NextResponse.json({
      success: true,
      personalizedMessage,
      originalMessage: baseMessage,
    });
  } catch (error) {
    console.error("Erro ao gerar mensagem de campanha:", error);
    return NextResponse.json(
      { error: "Erro ao gerar mensagem de campanha" },
      { status: 500 }
    );
  }
}