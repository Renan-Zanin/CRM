import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const { name, phone, category, company } = await req.json();

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Nome é necessário", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("Telefone é necessário", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id é necessário", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Não autorizado", { status: 403 });
    }

    const supplier = await prismadb.supplier.create({
      data: {
        name,
        phone,
        category,
        company,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(supplier);
  } catch (err) {
    console.log("[SUPPLIERS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const suppliers = await prismadb.supplier.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(suppliers);
  } catch (err) {
    console.log("[SUPPLIER_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
