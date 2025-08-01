import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const agents = await db.aIAgent.findMany({
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            model: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(agents);
  } catch (error) {
    console.error("Erro ao buscar agentes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agentes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, systemPrompt, providerId, model, temperature, maxTokens, isActive = true } = body;

    if (!name || !systemPrompt || !providerId || !model) {
      return NextResponse.json(
        { error: "Nome, prompt do sistema, provedor e modelo são obrigatórios" },
        { status: 400 }
      );
    }

    const agent = await db.aIAgent.create({
      data: {
        name,
        description,
        systemPrompt,
        providerId,
        model,
        temperature,
        maxTokens,
        isActive,
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            model: true,
          },
        },
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Erro ao criar agente:", error);
    return NextResponse.json(
      { error: "Erro ao criar agente" },
      { status: 500 }
    );
  }
}