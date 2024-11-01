import { Guest } from "@/components/Guest";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
export default async function Home() {
  const user = await currentUser();
  if (!user) {
    return <Guest />;
  }
  return (
    <div>
      <h1>{user.firstName}</h1>
    </div>
  );
}
