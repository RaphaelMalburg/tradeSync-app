"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Account } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { InfoIcon, Copy, Check, Pencil, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AccountSelector({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedAccountId = searchParams.get("accountId") || accounts[0]?.id;
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const currentAccount = accounts.find((account) => account.id === selectedAccountId);

  const handleAccountChange = (accountId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("accountId", accountId);
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  };

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentAccount) {
      try {
        await navigator.clipboard.writeText(currentAccount.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    // Navigate to edit page or open edit dialog
    router.push(`/dashboard/account/edit?accountId=${currentAccount?.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
    setOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/accounts/${currentAccount?.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      setShowDeleteDialog(false);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Select value={selectedAccountId} onValueChange={handleAccountChange}>
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
        {currentAccount && (
          <TooltipProvider>
            <Tooltip open={open} onOpenChange={setOpen}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <InfoIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover border border-border p-3" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-2.5 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-sm text-muted-foreground">ID: {currentAccount.id}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-muted " onClick={copyToClipboard}>
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3  text-black dark:text-white" />}
                    </Button>
                  </div>
                  <Separator className="bg-border" />
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 px-2 text-sm font-normal text-black dark:text-white hover:bg-muted"
                      onClick={handleEdit}>
                      <Pencil className="h-3 w-3" />
                      Edit Account
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 px-2 text-sm font-normal text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={handleDelete}>
                      <Trash2 className="h-3 w-3" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account &quot;{currentAccount?.name}&quot; and all its associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
