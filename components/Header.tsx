import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  return (
    <nav>
      <div>
        <h2>Trade Sync</h2>
        <div>
          <Link href="/">Home</Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Header;
