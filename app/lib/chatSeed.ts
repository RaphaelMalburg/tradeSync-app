// Ensure you are using the global prisma instance
export const fetchUserTrades = async (userId: string) => {
  try {
    // Check if globalThis.prisma is defined
    if (!globalThis.prisma) {
      throw new Error("Prisma instance is not defined.");
    }
    const trades = await globalThis.prisma.trade.findMany({
      where: { userId },
    });
    console.log("Trades:", trades);
    return trades;
  } catch (error) {
    console.error("Error fetching trades:", error);
    throw error; // Rethrow the error for further handling
  }
};
