"use server";

import { db } from "@/lib/db";
import { checkUser } from "@/lib/checkUser";
import crypto from "crypto";

export async function generateApiKey() {
  try {
    const user = await checkUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Generate a new API key (format: ct_xxxxxxxxxxxxx)
    const apiKey = `ct_${crypto.randomUUID().replace(/-/g, "")}`;

    // Update the user's API key in the database
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { apiKey },
    });

    return { apiKey: updatedUser.apiKey };
  } catch (error) {
    console.error("Failed to generate API key:", error);
    throw new Error("Failed to generate API key");
  }
}
