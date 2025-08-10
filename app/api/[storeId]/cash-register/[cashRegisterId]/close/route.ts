import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; cashRegisterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID é necessário", { status: 400 });
    }

    if (!params.cashRegisterId) {
      return new NextResponse("Cash Register ID é necessário", { status: 400 });
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

    // Buscar o caixa e suas transações
    const cashRegister = await prismadb.cashRegister.findUnique({
      where: {
        id: params.cashRegisterId,
      },
      include: {
        transactions: true,
      },
    });

    if (!cashRegister) {
      return new NextResponse("Caixa não encontrado", { status: 404 });
    }

    if (!cashRegister.isOpen) {
      return new NextResponse("Caixa já está fechado", { status: 400 });
    }

    // Calcular totais
    const totalIncoming = cashRegister.transactions
      .filter((t) => t.type === "incoming")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOutgoing = cashRegister.transactions
      .filter((t) => t.type === "outgoing")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = cashRegister.openingAmount + totalIncoming - totalOutgoing;
    const closingAmount =
      cashRegister.openingAmount + totalIncoming - totalOutgoing;

    // Fechar o caixa
    const updatedCashRegister = await prismadb.cashRegister.update({
      where: {
        id: params.cashRegisterId,
      },
      data: {
        isOpen: false,
        closingDate: new Date(),
        totalIncoming,
        totalOutgoing,
        profit,
        closingAmount,
      },
      include: {
        transactions: true,
      },
    });

    return NextResponse.json(updatedCashRegister);
  } catch (error) {
    console.log("[CASH_REGISTER_CLOSE]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
