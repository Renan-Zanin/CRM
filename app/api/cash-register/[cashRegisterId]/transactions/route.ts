import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { cashRegisterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!params.cashRegisterId) {
      return new NextResponse("Cash Register ID é necessário", { status: 400 });
    }

    const transactions = await prismadb.cashTransaction.findMany({
      where: {
        cashRegisterId: params.cashRegisterId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.log("[CASH_TRANSACTIONS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { cashRegisterId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { amount, type, paymentMethod, description } = body;

    if (!userId) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!amount) {
      return new NextResponse("Valor é necessário", { status: 400 });
    }

    if (!type) {
      return new NextResponse("Tipo é necessário", { status: 400 });
    }

    if (!paymentMethod) {
      return new NextResponse("Método de pagamento é necessário", {
        status: 400,
      });
    }

    if (!params.cashRegisterId) {
      return new NextResponse("Cash Register ID é necessário", { status: 400 });
    }

    // Verificar se o caixa existe e está aberto
    const cashRegister = await prismadb.cashRegister.findFirst({
      where: {
        id: params.cashRegisterId,
        isOpen: true,
      },
    });

    if (!cashRegister) {
      return new NextResponse("Caixa não encontrado ou já está fechado", {
        status: 404,
      });
    }

    const transaction = await prismadb.cashTransaction.create({
      data: {
        cashRegisterId: params.cashRegisterId,
        amount: parseFloat(amount),
        type,
        paymentMethod,
        description,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.log("[CASH_TRANSACTIONS_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
