import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, message, direction = "INCOMING", mediaUrl, mediaType } = body;

    if (!leadId || !message) {
      return NextResponse.json(
        { error: "Lead ID e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    const whatsappMessage = await db.whatsAppMessage.create({
      data: {
        leadId,
        message,
        direction,
        mediaUrl,
        mediaType,
      },
    });

    await db.lead.update({
      where: { id: leadId },
      data: {
        lastContact: new Date(),
      },
    });

    return NextResponse.json(whatsappMessage);
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    return NextResponse.json(
      { error: "Erro ao criar mensagem" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");

    if (leadId) {
      const messages = await db.whatsAppMessage.findMany({
        where: { leadId },
        orderBy: {
          timestamp: "desc",
        },
      });

      return NextResponse.json(messages);
    }

    const messages = await db.whatsAppMessage.findMany({
      orderBy: {
        timestamp: "desc",
      },
      take: 50,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mensagens" },
      { status: 500 }
    );
  }
}