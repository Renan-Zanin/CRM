import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    if (!params.clientId) {
      return new NextResponse("Id da categoria é necessário", { status: 400 });
    }

    const category = await prismadb.client.findUnique({
      where: {
        id: params.clientId,
      },
    });

    return NextResponse.json(category);
  } catch (err) {
    console.log("[CATEGORY_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; clientId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, phone } = body;

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Nome é necessário", { status: 400 });
    }
    if (!phone) {
      return new NextResponse("Telefone é necessário", { status: 400 });
    }

    if (!params.clientId) {
      return new NextResponse("Id do cliente é necessário", { status: 400 });
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

    const client = await prismadb.client.updateMany({
      where: {
        id: params.clientId,
      },
      data: {
        name,
        phone,
      },
    });

    return NextResponse.json(client);
  } catch (err) {
    console.log("[CLIENT_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; clientId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.clientId) {
      return new NextResponse("Client id é necessário", { status: 400 });
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

    const client = await prismadb.client.deleteMany({
      where: {
        id: params.clientId,
      },
    });

    return NextResponse.json(client);
  } catch (err) {
    console.log("[CLIENT_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
