import { getEventBySlug, getStagesBySlug } from "@/lib/events/getEvents";
import { slugify } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { siteRoute } from "@/siteConfig";
import { EventHeader } from "../components/event-header";
import { TabsSelector } from "../components/tabs-selector";
import { StagesCardsSection } from "../components/stages-section";
import { ResultsSnapshotSection } from "../components/results-snapshot-section";
import { getLastStageWithResults } from "@/lib/events/events-utils";

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

  if (event.isSingleDay) {
    redirect(siteRoute.events.root(slug, year));
  }

  // Name of the stages to open the results tab with.
  const stage = getLastStageWithResults(stages) || stages[0];

  return (
    <>
      <EventHeader event={event} />
      <div className="mt-10 space-y-10">
        {stages && (
          <>
            <ResultsSnapshotSection event={event} stages={stages} />
            <TabsSelector resultsStageSlug={slugify(stage.name)} />
            <StagesCardsSection stages={stages} />
          </>
        )}
      </div>
    </>
  );
};

export default Page;
