import { getEvent, getStages } from "@/lib/events/getEvents";
import { StagesCardsSection } from "../components/stages-section";
import { TabsSelector } from "../components/tabs-selector";
import { EventHeader } from "../components/event-header";
import { slugify } from "@/lib/utils";
import FinalResultsSection from "../components/final-results-section";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const event = await getEvent(id);
  const stages = await getStages(id);

  return (
    <>
      <EventHeader event={event} />
      <div className="mt-10 space-y-10">
        <FinalResultsSection results={event.results} />
        <TabsSelector resultsStageSlug={slugify(stages[0].name)} />
        <StagesCardsSection stages={stages} />
      </div>
    </>
  );
};

export default Page;
