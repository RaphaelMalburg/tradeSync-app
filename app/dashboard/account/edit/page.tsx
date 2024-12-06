"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Account } from "@/types";

export default function EditAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");
  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"Demo" | "Live">("Demo");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!accountId) return;
      try {
        const response = await fetch(`/api/accounts/${accountId}`);
        const data = await response.json();
        setAccount(data);
        setName(data.name);
        setAccountType(data.accountType);
      } catch (error) {
        console.error("Failed to fetch account:", error);
        router.push("/dashboard");
      }
    };

    fetchAccount();
  }, [accountId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          accountType,
        }),
      });

      if (!response.ok) throw new Error("Failed to update account");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Failed to update account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter account name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Type</label>
              <Select value={accountType} onValueChange={(value: "Demo" | "Live") => setAccountType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Demo">Demo Account</SelectItem>
                  <SelectItem value="Live">Live Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
