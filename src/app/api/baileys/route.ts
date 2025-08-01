import { NextRequest, NextResponse } from "next/server";
import { baileysService } from "@/lib/services/baileys";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "status":
        const status = await baileysService.getConnectionStatus();
        return NextResponse.json(status);

      case "qr":
        const qrCode = await baileysService.getQRCode();
        return NextResponse.json({ qrCode });

      default:
        return NextResponse.json(
          { error: "Ação não especificada" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erro ao processar requisição Baileys:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, to, message } = body;

    switch (action) {
      case "connect":
        const connected = await baileysService.connect();
        return NextResponse.json({ connected });

      case "send":
        if (!to || !message) {
          return NextResponse.json(
            { error: "Destinatário e mensagem são obrigatórios" },
            { status: 400 }
          );
        }
        const sent = await baileysService.sendMessage(to, message);
        return NextResponse.json({ sent });

      default:
        return NextResponse.json(
          { error: "Ação não especificada" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erro ao processar requisição Baileys:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}