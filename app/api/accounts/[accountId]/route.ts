/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkUser } from "@/lib/checkUser";

type RouteContext = {
  params: Promise<{ accountId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { accountId } = await context.params;

    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await db.account.findUnique({
      where: {
        id: accountId,
        userId: user.id,
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json({ error: "Failed to fetch account" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { accountId } = await context.params;
    const data = await request.json();

    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: {
        name: data.name,
        accountType: data.accountType,
      },
    });

    return NextResponse.json({ accountId, ...data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { accountId } = await context.params;
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.account.delete({
      where: {
        id: accountId,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
