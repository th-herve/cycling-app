import { getLastStageWithResults } from "@/lib/events/events-utils";
import { getEventBySlug, getStagesBySlug } from "@/lib/events/getEvents";
import { slugify } from "@/lib/utils";
import { siteRoute } from "@/siteConfig";
import { notFound, redirect } from "next/navigation";
import { EventHeader } from "../components/event-header";

interface Props {
  params: Promise<{ slug: string; year: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug, year } = await params;

  const [event, stages] = await Promise.all([
    getEventBySlug(slug, year),
    getStagesBySlug(slug, year),
  ]);

  if (!event) {
    notFound();
  }

  // Only shows the header if there is no stages yet.
  if (!stages || stages.length <= 0) {
    return <EventHeader event={event} />;
  }

  // Name of the stages to open the results tab with.
  const stage = getLastStageWithResults(stages) || stages[0];
  redirect(siteRoute.events.results(slug, year, slugify(stage.name)));
};

export default Page;
