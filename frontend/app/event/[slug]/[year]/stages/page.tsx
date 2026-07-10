import {
  getEventBySlug,
  getStagesBySlug,
} from "@/lib/events/getEvents";
import { slugify } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { siteRoute } from "@/siteConfig";
import { EventHeader } from "../components/event-header";
import { TabsSelector } from "../components/tabs-selector";
import { StagesCardsSection } from "../components/stages-section";
import { ResultsSnapshotSection } from "../components/results-snapshot-section";

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
    redirect(siteRoute.event.root(slug, year));
  }

  return (
    <>
      <EventHeader event={event} />
      <div className="mt-10 space-y-10">
        {stages && (
          <>
            <ResultsSnapshotSection event={event} stages={stages} />
            <TabsSelector resultsStageSlug={slugify(stages[0].name)} />
            <StagesCardsSection stages={stages} />
          </>
        )}
      </div>
    </>
  );
};

export default Page;
