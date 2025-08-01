import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await db.aICampaign.findUnique({
      where: { id: params.id },
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

    if (!campaign) {
      return NextResponse.json(
        { error: "Campanha não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Erro ao buscar campanha:", error);
    return NextResponse.json(
      { error: "Erro ao buscar campanha" },
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
    const { name, description, providerId, agentId, message, status, targetLeads, scheduledAt, sentCount, deliveredCount, repliedCount, startedAt, completedAt } = body;

    const campaign = await db.aICampaign.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(providerId && { providerId }),
        ...(agentId && { agentId }),
        ...(message && { message }),
        ...(status && { status }),
        ...(targetLeads !== undefined && { targetLeads }),
        ...(sentCount !== undefined && { sentCount }),
        ...(deliveredCount !== undefined && { deliveredCount }),
        ...(repliedCount !== undefined && { repliedCount }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(startedAt !== undefined && { startedAt: startedAt ? new Date(startedAt) : null }),
        ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
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
    console.error("Erro ao atualizar campanha:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar campanha" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.aICampaign.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Campanha excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir campanha:", error);
    return NextResponse.json(
      { error: "Erro ao excluir campanha" },
      { status: 500 }
    );
  }
}