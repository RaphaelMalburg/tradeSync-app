import type { Metadata } from "next";

export const runtime = "edge";

type PageProps = {
  params: Promise<{ userId: string }>; // `params` is now a Promise
};

export default async function ProfilePage({ params }: PageProps) {
  const resolvedParams = await params; // Await the promise to get actual data
  const { userId } = resolvedParams;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Profile {userId}</h1>
      {/* Add your profile content here */}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params; // Await the promise to get actual data

  return {
    title: `Profile ${resolvedParams.userId}`,
  };
}
