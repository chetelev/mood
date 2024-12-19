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
  });
  return entry;
};

const EntryPage = async ({ params }) => {
  const entry = await getEntry(params.id);
  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
