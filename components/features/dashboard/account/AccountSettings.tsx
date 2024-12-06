"use client";

import { Account } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface AccountSettingsProps {
  account: Account;
}

export function AccountSettings({ account }: AccountSettingsProps) {
  const [copied, setCopied] = useState(false);

  const copyAccountId = async () => {
    await navigator.clipboard.writeText(account.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{account.name}</CardTitle>
        <CardDescription>{account.accountType} Account Settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Account ID</label>
          <div className="flex items-center justify-between bg-muted p-3 rounded-md">
            <code className="text-sm">{account.id}</code>
            <Button variant="ghost" size="icon" onClick={copyAccountId}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Use this ID in your cTrader plugin settings to connect it with this account.</p>
        </div>
      </CardContent>
    </Card>
  );
}
