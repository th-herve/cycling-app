import { getEvent, getStages } from "@/lib/events/getEvents";
import { StagesCardsSection } from "../components/stages-section";
import { TabsSelector } from "../components/tabs-selector";
import { EventHeader } from "../components/event-header";
import { slugify } from "@/lib/utils";
import { ResultsSnapshotSection } from "../components/results-snapshot-section";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const [event, stages] = await Promise.all([getEvent(id), getStages(id)]);

  if (!event) {
    notFound();
  }

  return (
    <>
      <EventHeader event={event} />
      <div className="mt-10 space-y-10">
        <ResultsSnapshotSection event={event} stages={stages} />
        <TabsSelector resultsStageSlug={slugify(stages[0].name)} />
        <StagesCardsSection stages={stages} />
      </div>
    </>
  );
};

export default Page;
