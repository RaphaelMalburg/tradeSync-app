// lib/dto/account.dto.ts
export interface CreateAccountDTO {
  name: string;
  description?: string;
  accountType: "Demo" | "Live";
  userId: string;
}

export interface AccountDTO {
  id: string;
  name: string;
  description?: string;
  accountType: string;
  createdAt: Date;
  updatedAt: Date;
}
