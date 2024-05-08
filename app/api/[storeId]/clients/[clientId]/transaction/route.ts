import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { value, type } = await req.json();

    if (!value) {
      return new NextResponse("Valor da transação é necessário", {
        status: 400,
      });
    }

    if (!type) {
      return new NextResponse("Tipo da transação é necessário", {
        status: 400,
      });
    }

    const client = await prismadb.clientValue.create({
      data: {
        clientId: params.clientId,
        value,
        type,
      },
    });

    return NextResponse.json(client);
  } catch (err) {
    console.log("[STORES_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    if (!params.clientId) {
      return new NextResponse("Id da categoria é necessário", { status: 400 });
    }

    const transactions = await prismadb.clientValue.findMany({
      where: {
        clientId: params.clientId,
      },
    });

    return NextResponse.json(transactions);
  } catch (err) {
    console.log("[CATEGORY_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
