"use client";

import Terms from "@/components/auth/Terms";
import { UserProfile } from "@clerk/nextjs";
import { ReceiptText } from "lucide-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const UserProfilePage = () => {
  const { theme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-lg">
      <UserProfile path="/profile" routing="path" appearance={{ baseTheme: theme === "dark" ? dark : undefined }}>
        <UserProfile.Page label="Terms" labelIcon={<ReceiptText className="w-4 h-4" />} url="terms">
          <Terms />
        </UserProfile.Page>
      </UserProfile>
    </div>
  );
};

export default UserProfilePage;
