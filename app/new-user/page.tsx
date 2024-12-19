import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();
  console.log(user);

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user?.id as string,
    },
  });

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user?.id as string,
        email: user?.emailAddresses[0].emailAddress as string,
      },
    });
  }

  redirect("/journal");
};
const NewUserPage = async () => {
  await createNewUser();
  return <div>...loading</div>;
};

export default NewUserPage;
