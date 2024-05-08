import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { stockId: string } }
) {
  try {
    if (!params.stockId) {
      return new NextResponse("Id do fornecedor é necessário", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.stockId,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.log("[PRODUCT_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; stockId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { code, name, brand, quantity, sellPrice } = body;

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 });
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

    if (!params.stockId) {
      return new NextResponse("Id do produto é necessário", { status: 400 });
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

    const product = await prismadb.product.updateMany({
      where: {
        id: params.stockId,
      },
      data: {
        code,
        name,
        brand,
        quantity,
        sellPrice,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.log("[PRODUCT_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; stockId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.stockId) {
      return new NextResponse("Id do fornecedor é necessário", { status: 400 });
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

    const client = await prismadb.product.deleteMany({
      where: {
        id: params.stockId,
      },
    });

    return NextResponse.json(client);
  } catch (err) {
    console.log("[PRODUCT_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
