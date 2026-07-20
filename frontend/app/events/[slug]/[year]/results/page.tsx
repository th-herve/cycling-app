import { getLastStageWithResults } from "@/lib/events/events-utils";
import { getStagesBySlug } from "@/lib/events/getEvents";
import { slugify } from "@/lib/utils";
import { siteRoute } from "@/siteConfig";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string; year: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug, year } = await params;

  const stages = await getStagesBySlug(slug, year);

  // TODO this is wrong in the case where an event does not have stages yet.
  if (!stages || stages.length <= 0) {
    notFound();
  }

  // Name of the stages to open the results tab with.
  const stage = getLastStageWithResults(stages) || stages[0];

  redirect(siteRoute.events.results(slug, year, slugify(stage.name)));
};

export default Page;
