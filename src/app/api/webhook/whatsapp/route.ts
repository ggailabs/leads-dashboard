import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      from, 
      message, 
      messageType = "text",
      mediaUrl,
      mediaType,
      timestamp = new Date().toISOString(),
      senderName 
    } = body;

    if (!from || !message) {
      return NextResponse.json(
        { error: "Número de telefone e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    const cleanPhone = from.replace(/\D/g, "");
    
    let lead = await db.lead.findUnique({
      where: { phone: cleanPhone },
    });

    if (!lead) {
      lead = await db.lead.create({
        data: {
          phone: cleanPhone,
          name: senderName,
          source: "whatsapp",
          status: "NEW",
        },
      });
    }

    const whatsappMessage = await db.whatsAppMessage.create({
      data: {
        leadId: lead.id,
        message,
        direction: "INCOMING",
        mediaUrl,
        mediaType,
        timestamp: new Date(timestamp),
      },
    });

    await db.lead.update({
      where: { id: lead.id },
      data: {
        lastContact: new Date(timestamp),
      },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      messageId: whatsappMessage.id,
    });
  } catch (error) {
    console.error("Erro ao processar webhook do WhatsApp:", error);
    return NextResponse.json(
      { error: "Erro ao processar mensagem do WhatsApp" },
      { status: 500 }
    );
  }
}