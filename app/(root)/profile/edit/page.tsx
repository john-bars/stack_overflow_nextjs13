import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!session) {
    redirect("/login");
  }

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  const serializedUser = {
    ...mongoUser._doc,
    _id: mongoUser._id.toString(),
    joinedAt: mongoUser.joinedAt?.toISOString(),
    createdAt: mongoUser.createdAt?.toISOString(),
    updatedAt: mongoUser.updatedAt?.toISOString(),
  };

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile userId={userId} user={serializedUser} />
      </div>
    </>
  );
};

export default Page;
