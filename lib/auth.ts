import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export const getUserByClerkId = async () => {
  const { userId } = await auth();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
  });

  return user;
};
