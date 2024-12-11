import { Metadata } from "next";

export const runtime = "edge";

type PageProps = {
  params: {
    userId: string;
  };
};

export default async function ProfilePage({ params }: Awaited<PageProps>) {
  const { userId } = params;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Profile {userId}</h1>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Profile ${params.userId}`,
  };
}
