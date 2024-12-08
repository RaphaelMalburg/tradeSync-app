import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkUser } from "@/lib/checkUser";

export async function GET() {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const strategies = await db.strategy.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(strategies);
  } catch (error) {
    console.error("Failed to fetch strategies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const strategy = await db.strategy.create({
      data: {
        name,
        description,
        userId: user.id,
      },
    });

    return NextResponse.json(strategy);
  } catch (error) {
    console.error("Failed to create strategy:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
