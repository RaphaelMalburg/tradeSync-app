import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  try {
    const trades = await prisma.trade.findMany({
      skip,
      take: limit,
      orderBy: {
        entryTime: "desc",
      },
      include: {
        strategy: true,
      },
    });

    return Response.json(trades);
  } catch (error) {
    console.error("Error fetching trades:", error);
    return Response.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}
