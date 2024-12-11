type Props = {
  params: {
    userId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProfilePage({ params }: Props) {
  const { userId } = params;

  // Now you can safely use userId
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Profile {userId}</h1>
      {/* Add your profile content here */}
    </div>
  );
}
