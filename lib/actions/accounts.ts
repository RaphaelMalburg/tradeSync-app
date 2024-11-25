"use server";

import { db } from "@/lib/db";
import { checkUser } from "@/lib/checkUser";
import { CreateAccountDTO } from "@/lib/dto/account.dto";

export async function createAccount(data: CreateAccountDTO) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  return db.account.create({
    data: {
      ...data,
      userId: user.id,
    },
  });
}

export async function deleteAccount(id: string) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  return db.account.delete({
    where: {
      id,
      userId: user.id, // Ensure user owns the account
    },
  });
}
// Start Generation Here
export async function getAccounts() {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  return db.account.findMany({
    where: {
      userId: user.id,
    },
  });
}
