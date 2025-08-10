import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string; clientId: string } }
) {
  try {
    const { userId } = auth();
    const { value, type } = await req.json();

    if (!userId) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

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

    // Buscar informações do cliente
    const client = await prismadb.client.findUnique({
      where: {
        id: params.clientId,
      },
    });

    if (!client) {
      return new NextResponse("Cliente não encontrado", { status: 404 });
    }

    // Verificar se existe um caixa aberto
    const openCashRegister = await prismadb.cashRegister.findFirst({
      where: {
        storeId: params.storeId,
        isOpen: true,
      },
    });

    // Criar a transação do cliente
    const clientTransaction = await prismadb.clientValue.create({
      data: {
        clientId: params.clientId,
        value,
        type,
      },
    });

    // Se existe caixa aberto, criar transação no caixa também
    if (openCashRegister) {
      let cashTransactionData: any = {
        cashRegisterId: openCashRegister.id,
        amount: parseFloat(value),
        description: `Cliente: ${client.name}`,
      };

      if (type === "deve") {
        // Transação "deve" - não soma nem subtrai, apenas registra como fiado
        cashTransactionData.type = "fiado_pending"; // Novo tipo
        cashTransactionData.paymentMethod = "fiado";
      } else if (type === "pago") {
        // Transação "pago" - soma como entrada, mas não registra método de pagamento
        cashTransactionData.type = "incoming";
        cashTransactionData.paymentMethod = "fiado_payment"; // Novo tipo para identificar pagamento de fiado
      }

      // Criar transação no caixa
      await prismadb.cashTransaction.create({
        data: cashTransactionData,
      });
    }

    return NextResponse.json(clientTransaction);
  } catch (err) {
    console.log("[CLIENT_TRANSACTION_POST]", err);
    return new NextResponse("Erro interno", { status: 500 });
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
