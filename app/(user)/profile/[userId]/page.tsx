interface ProfileProps {
  params: {
    userId: string;
  };
}

export default async function Profile({ params }: ProfileProps) {
  const { userId } = params;

  // Now you can safely use userId
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Profile {userId}</h1>
      {/* Add your profile content here */}
    </div>
  );
}
