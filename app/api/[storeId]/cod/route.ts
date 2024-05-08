import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method === "GET" || req.method === "OPTIONS") {
    try {
      const code = req.nextUrl.searchParams.get("code");

      if (typeof code !== "string") {
        throw new Error("Requisição inválida");
      }

      const searchProducts = await prismadb.product.findFirst({
        select: {
          code: true,
          name: true,
          sellPrice: true,
        },
        where: {
          OR: [
            {
              code: code,
            },
          ],
        },
      });

      return NextResponse.json(searchProducts);
    } catch (err) {
      console.log("[PRODUCTS_GET]", err);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
}
