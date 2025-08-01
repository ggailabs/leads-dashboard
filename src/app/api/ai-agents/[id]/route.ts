import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await db.aIAgent.findUnique({
      where: { id: params.id },
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

    if (!agent) {
      return NextResponse.json(
        { error: "Agente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Erro ao buscar agente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agente" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, systemPrompt, providerId, model, temperature, maxTokens, isActive } = body;

    const agent = await db.aIAgent.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(systemPrompt && { systemPrompt }),
        ...(providerId && { providerId }),
        ...(model && { model }),
        ...(temperature !== undefined && { temperature }),
        ...(maxTokens !== undefined && { maxTokens }),
        ...(isActive !== undefined && { isActive }),
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
    console.error("Erro ao atualizar agente:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar agente" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.aIAgent.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Agente excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir agente:", error);
    return NextResponse.json(
      { error: "Erro ao excluir agente" },
      { status: 500 }
    );
  }
}