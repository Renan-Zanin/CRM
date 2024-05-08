import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { supplierId: string } }
) {
  try {
    if (!params.supplierId) {
      return new NextResponse("Id do fornecedor é necessário", { status: 400 });
    }

    const supplier = await prismadb.supplier.findUnique({
      where: {
        id: params.supplierId,
      },
    });

    return NextResponse.json(supplier);
  } catch (err) {
    console.log("[SUPPLIER_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; supplierId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, phone, category, company } = body;

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Nome é necessário", { status: 400 });
    }
    if (!phone) {
      return new NextResponse("Telefone é necessário", { status: 400 });
    }
    if (!category) {
      return new NextResponse("Categoria é necessário", { status: 400 });
    }
    if (!company) {
      return new NextResponse("Empresa é necessário", { status: 400 });
    }

    if (!params.supplierId) {
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

    const supplier = await prismadb.supplier.updateMany({
      where: {
        id: params.supplierId,
      },
      data: {
        name,
        phone,
        category,
        company,
      },
    });

    return NextResponse.json(supplier);
  } catch (err) {
    console.log("[SUPPLIER_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; supplierId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.supplierId) {
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

    const client = await prismadb.supplier.deleteMany({
      where: {
        id: params.supplierId,
      },
    });

    return NextResponse.json(client);
  } catch (err) {
    console.log("[CLIENT_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
