import { getUserByClerkId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { qa } from "@/lib/ai";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { question } = await request.json();
  const user = await getUserByClerkId();

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  const answer = await qa(question, entries);
  return NextResponse.json({ data: answer });
};
