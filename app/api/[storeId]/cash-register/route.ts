import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID é necessário", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Loja não encontrada", { status: 404 });
    }

    const cashRegisters = await prismadb.cashRegister.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        transactions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cashRegisters);
  } catch (error) {
    console.log("[CASH_REGISTER_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { openingAmount } = body;

    if (!userId) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!openingAmount && openingAmount !== 0) {
      return new NextResponse("Valor de abertura é necessário", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID é necessário", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Loja não encontrada", { status: 404 });
    }

    // Verificar se já existe um caixa aberto
    const existingOpenCashRegister = await prismadb.cashRegister.findFirst({
      where: {
        storeId: params.storeId,
        isOpen: true,
      },
    });

    if (existingOpenCashRegister) {
      return new NextResponse("Já existe um caixa aberto", { status: 400 });
    }

    const cashRegister = await prismadb.cashRegister.create({
      data: {
        storeId: params.storeId,
        openingAmount,
        userId,
      },
      include: {
        transactions: true,
      },
    });

    return NextResponse.json(cashRegister);
  } catch (error) {
    console.log("[CASH_REGISTER_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
