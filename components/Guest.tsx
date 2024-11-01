import { SignIn } from "@clerk/nextjs";

export const Guest = () => {
  return (
    <div>
      <h1>Guest</h1>
      <p>Welcome to our website, please sign up or log in to access the content.</p>
      <SignIn />
    </div>
  );
};
