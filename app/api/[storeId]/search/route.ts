import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: NextRequest) {
  if (req.method === "GET" || req.method === "OPTIONS") {
    try {
      const term = req.nextUrl.searchParams.get("term");

      if (typeof term !== "string") {
        throw new Error("Requisição inválida");
      }

      const searchProducts = await prismadb.product.findMany({
        select: {
          code: true,
          name: true,
        },
        where: {
          OR: [
            {
              name: {
                contains: term,
              },
            },
            {
              brand: {
                contains: term,
              },
            },
          ],
        },
      });

      console.log(searchProducts);

      return NextResponse.json(searchProducts);
    } catch (err) {
      console.log("[PRODUCTS_GET]", err);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
}
