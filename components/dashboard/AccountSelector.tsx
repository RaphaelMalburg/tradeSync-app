"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Account } from "@/types";
import { useRouter } from "next/navigation";

export function AccountSelector({ accounts, currentAccountId }: { accounts: Account[]; currentAccountId: string }) {
  const router = useRouter();

  const currentAccount = accounts.find((account) => account.id === currentAccountId);

  const handleAccountChange = (accountId: string) => {
    router.push(`/dashboard?accountId=${accountId}`);
  };

  return (
    <Select value={currentAccountId} onValueChange={handleAccountChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue>{currentAccount ? `${currentAccount.name} (${currentAccount.accountType})` : "Select Account"}</SelectValue>
      </SelectTrigger>

      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name} ({account.accountType})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
