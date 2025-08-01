import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provider = await db.aIProvider.findUnique({
      where: { id: params.id },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provedor não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Erro ao buscar provedor:", error);
    return NextResponse.json(
      { error: "Erro ao buscar provedor" },
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
    const { name, apiKey, baseUrl, model, isActive } = body;

    const provider = await db.aIProvider.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(apiKey && { apiKey }),
        ...(baseUrl !== undefined && { baseUrl }),
        ...(model && { model }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Erro ao atualizar provedor:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar provedor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.aIProvider.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Provedor excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir provedor:", error);
    return NextResponse.json(
      { error: "Erro ao excluir provedor" },
      { status: 500 }
    );
  }
}