import { Metadata } from "next";

export const runtime = "edge";

interface PageProps {
  params: {
    userId: string;
  };
}

export default function ProfilePage({ params }: PageProps) {
  const { userId } = params;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Profile {userId}</h1>
      {/* Add your profile content here */}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Profile ${params.userId}`,
  };
}
