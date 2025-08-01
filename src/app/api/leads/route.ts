import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const leads = await db.lead.findMany({
      where: {
        ...(status && status !== "all" && { status: status as any }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        messages: {
          orderBy: {
            timestamp: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const leadsWithCount = leads.map((lead) => ({
      ...lead,
      messageCount: lead.messages.length,
      lastContact: lead.messages[0]?.timestamp || null,
    }));

    return NextResponse.json(leadsWithCount);
  } catch (error) {
    console.error("Erro ao buscar leads:", error);
    return NextResponse.json(
      { error: "Erro ao buscar leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, status = "NEW", source = "whatsapp", notes } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Telefone é obrigatório" },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        name,
        phone,
        email,
        status,
        source,
        notes,
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Erro ao criar lead:", error);
    return NextResponse.json(
      { error: "Erro ao criar lead" },
      { status: 500 }
    );
  }
}