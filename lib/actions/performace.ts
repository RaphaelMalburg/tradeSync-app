"use server";
import { db } from "@/lib/db";
import { CreatePerformanceDTO, UpdatePerformanceDTO } from "@/lib/dto/user.dto";

export async function getPerformance(userId: string, accountId?: string) {
  const performances = await db.performance.findMany({
    where: {
      userId: userId,
      accountId: accountId,
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return performances;
}

export async function createPerformance(data: CreatePerformanceDTO) {
  const newPerformance = await db.performance.create({
    data: {
      userId: data.userId,
      accountId: data.accountId,
      winRate: data.winRate,
      averageHoldingTime: data.averageHoldingTime,
      averageProfitLoss: data.averageProfitLoss,
      maxDrawdown: data.maxDrawdown,
    },
  });
  return newPerformance;
}

export async function updatePerformance(id: string, data: UpdatePerformanceDTO) {
  const updatedPerformance = await db.performance.update({
    where: { id },
    data,
  });
  return updatedPerformance;
}

export async function deletePerformance(id: string) {
  const deletedPerformance = await db.performance.delete({
    where: { id },
  });
  return deletedPerformance;
}
