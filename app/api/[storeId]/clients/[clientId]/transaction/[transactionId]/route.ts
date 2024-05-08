import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function DELETE(
  req: Request,
  { params }: { params: { clientId: string; transactionId: string } }
) {
  try {
    if (!params.transactionId) {
      return new NextResponse("Billboard id é necessário", { status: 400 });
    }

    const storeByUserId = await prismadb.clientValue.findFirst({
      where: {
        id: params.transactionId,
        clientId: params.clientId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Não autorizado", { status: 403 });
    }

    const billboard = await prismadb.clientValue.deleteMany({
      where: {
        id: params.transactionId,
      },
    });

    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[BILLBOARD_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
