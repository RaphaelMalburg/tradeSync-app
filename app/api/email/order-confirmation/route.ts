import { NextResponse } from "next/server";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, orderDetails } = await req.json();

    if (!email || !orderDetails) {
      return NextResponse.json({ error: "Email and order details are required" }, { status: 400 });
    }

    await sendOrderConfirmation(email, orderDetails);
    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
