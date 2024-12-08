import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkUser } from "@/lib/checkUser";

export async function PATCH(req: NextRequest, { params }: { params: { tradeId: string } }) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { sentiment, strategy } = data;

    const trade = await db.trade.update({
      where: {
        id: params.tradeId,
        userId: user.id, // Ensure user owns the trade
      },
      data: {
        ...(sentiment && { sentiment }),
        ...(strategy && { strategy }),
      },
    });

    return NextResponse.json(trade);
  } catch (error) {
    console.error("Failed to update trade:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
