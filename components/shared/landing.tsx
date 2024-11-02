import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold">Welcome to TradeSync</h1>
      <p className="mt-4 text-lg">Your AI-powered trading assistant.</p>
      <div className="mt-6">
        <SignedOut>
          <SignInButton>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Go to Dashboard</button>
          </Link>
        </SignedIn>
      </div>
    </div>
  );
};

export default LandingPage;
