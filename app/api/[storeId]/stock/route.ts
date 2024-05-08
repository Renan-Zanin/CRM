import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const { code, name, brand, quantity, sellPrice } = await req.json();

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!code) {
      return new NextResponse("Código é necessário", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Nome é necessário", { status: 400 });
    }
    if (!brand) {
      return new NextResponse("Marca é necessária", { status: 400 });
    }
    if (!quantity) {
      return new NextResponse("Quantidade é necessária", { status: 400 });
    }

    if (!sellPrice) {
      return new NextResponse("Preço de venda é necessário", { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        code,
        name,
        brand,
        quantity,
        sellPrice,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.log("[PRODUCTS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.log("[PRODUCTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
