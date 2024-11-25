"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAccount } from "@/lib/actions/accounts";
import { Plus } from "lucide-react";

export function AccountDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"Demo" | "Live">("Demo");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount({ name, accountType, userId: "" }); // userId is set in server action
      setOpen(false);
      window.location.reload(); // Refresh to show new account
    } catch (error) {
      console.error("Failed to create account:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Trading Account</DialogTitle>
        </DialogHeader>
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
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
