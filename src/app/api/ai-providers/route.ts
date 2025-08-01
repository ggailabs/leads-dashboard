import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const providers = await db.aIProvider.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(providers);
  } catch (error) {
    console.error("Erro ao buscar provedores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar provedores" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, apiKey, baseUrl, model, isActive = true } = body;

    if (!name || !apiKey || !model) {
      return NextResponse.json(
        { error: "Nome, chave da API e modelo são obrigatórios" },
        { status: 400 }
      );
    }

    const provider = await db.aIProvider.create({
      data: {
        name,
        apiKey,
        baseUrl,
        model,
        isActive,
      },
    });

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Erro ao criar provedor:", error);
    return NextResponse.json(
      { error: "Erro ao criar provedor" },
      { status: 500 }
    );
  }
}