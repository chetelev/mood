import Editor from "@/components/Editor";
import { getUserByClerkId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const getEntry = async (id) => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id: id,
      },
    },
    include: {
      analysis: true,
    },
  });
  return entry;
};

const EntryPage = async ({ params }) => {
  const { id } = await params;
  const entry = await getEntry(id);
  return (
    <div className="w-full h-full ">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
