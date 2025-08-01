import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const campaigns = await db.aICampaign.findMany({
      include: {
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Erro ao buscar campanhas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar campanhas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, providerId, agentId, message, status = "DRAFT", targetLeads = 0, scheduledAt } = body;

    if (!name || !providerId || !agentId || !message) {
      return NextResponse.json(
        { error: "Nome, provedor, agente e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    const campaign = await db.aICampaign.create({
      data: {
        name,
        description,
        providerId,
        agentId,
        message,
        status,
        targetLeads,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Erro ao criar campanha:", error);
    return NextResponse.json(
      { error: "Erro ao criar campanha" },
      { status: 500 }
    );
  }
}