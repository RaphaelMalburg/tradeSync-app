export interface User {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  imageUrl: string;
  apiKey?: string;
}

export interface Account {
  id: string;
  name: string;
  accountType: string;
}
