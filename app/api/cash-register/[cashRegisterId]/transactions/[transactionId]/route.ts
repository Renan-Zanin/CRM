import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { cashRegisterId: string; transactionId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { amount, type, paymentMethod, description } = body;

    if (!userId) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!params.cashRegisterId) {
      return new NextResponse("Cash Register ID é necessário", { status: 400 });
    }

    if (!params.transactionId) {
      return new NextResponse("Transaction ID é necessário", { status: 400 });
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

    // Verificar se a transação existe e pertence ao cash register correto
    const existingTransaction = await prismadb.cashTransaction.findFirst({
      where: {
        id: params.transactionId,
        cashRegisterId: params.cashRegisterId,
      },
    });

    if (!existingTransaction) {
      return new NextResponse("Transação não encontrada", { status: 404 });
    }

    // Verificar se o cash register ainda está aberto
    const cashRegister = await prismadb.cashRegister.findUnique({
      where: {
        id: params.cashRegisterId,
      },
    });

    if (!cashRegister || !cashRegister.isOpen) {
      return new NextResponse(
        "Não é possível editar transações de um caixa fechado",
        { status: 400 }
      );
    }

    const transaction = await prismadb.cashTransaction.update({
      where: {
        id: params.transactionId,
      },
      data: {
        amount: parseFloat(amount),
        type,
        paymentMethod,
        description: description || null,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.log("[CASH_TRANSACTION_PATCH]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { cashRegisterId: string; transactionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!params.cashRegisterId) {
      return new NextResponse("Cash Register ID é necessário", { status: 400 });
    }

    if (!params.transactionId) {
      return new NextResponse("Transaction ID é necessário", { status: 400 });
    }

    // Verificar se a transação existe e pertence ao cash register correto
    const existingTransaction = await prismadb.cashTransaction.findFirst({
      where: {
        id: params.transactionId,
        cashRegisterId: params.cashRegisterId,
      },
    });

    if (!existingTransaction) {
      return new NextResponse("Transação não encontrada", { status: 404 });
    }

    // Verificar se o cash register ainda está aberto
    const cashRegister = await prismadb.cashRegister.findUnique({
      where: {
        id: params.cashRegisterId,
      },
    });

    if (!cashRegister || !cashRegister.isOpen) {
      return new NextResponse(
        "Não é possível deletar transações de um caixa fechado",
        { status: 400 }
      );
    }

    await prismadb.cashTransaction.delete({
      where: {
        id: params.transactionId,
      },
    });

    return NextResponse.json({ message: "Transação deletada com sucesso" });
  } catch (error) {
    console.log("[CASH_TRANSACTION_DELETE]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
