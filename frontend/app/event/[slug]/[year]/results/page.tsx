import { getStages } from "@/lib/events/getEvents";
import { slugify } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string; stageID: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;

  const stages = await getStages(id);

  if (!stages || stages.length <= 0) {
    notFound();
  }

  const stageSlug = slugify(stages[0].name);

  redirect(`/event/${id}/results/${stageSlug}`);
};

export default Page;
