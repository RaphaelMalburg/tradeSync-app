"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAccount } from "@/lib/actions/accounts";
import { Plus, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Account } from "@/types";

export function AccountDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"Demo" | "Live">("Demo");
  const [newAccount, setNewAccount] = useState<Account | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const account = await createAccount({ name, accountType, userId: "" }); // userId is set in server action
      setNewAccount(account);
    } catch (error) {
      console.error("Failed to create account:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewAccount(null);
    setName("");
    setAccountType("Demo");
    setCopied(false);
    router.refresh();
  };

  const copyAccountId = async () => {
    if (newAccount) {
      await navigator.clipboard.writeText(newAccount.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Trading Account</DialogTitle>
          <DialogDescription>Create a new account to track trades from different sources or strategies.</DialogDescription>
        </DialogHeader>

        {newAccount ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription className="space-y-3">
                <p>Account created successfully! Use these details in your plugin settings:</p>
                <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <code className="text-sm">Account ID: {newAccount.id}</code>
                  <Button variant="ghost" size="icon" onClick={copyAccountId}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Make sure to copy this ID now. You can always find it later in account settings.</p>
              </AlertDescription>
            </Alert>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Account Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Select value={accountType} onValueChange={(value: "Demo" | "Live") => setAccountType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Demo">Demo Account</SelectItem>
                <SelectItem value="Live">Live Account</SelectItem>
              </SelectContent>
            </Select>
            <Alert>
              <AlertDescription>After creating the account, you'll get an Account ID to use in your cTrader plugin settings.</AlertDescription>
            </Alert>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
