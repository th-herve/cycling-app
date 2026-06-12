import { getEvent, getStages } from "@/lib/events/getEvents";
import { StagesViewSelector } from "../components/stages-section";
import { TabsSelector } from "../components/tabs-selector";
import { EventHeader } from "../components/event-header";
import { slugify } from "@/lib/utils";

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
      <div className="mt-10 space-y-20">
        <TabsSelector resultsStageSlug={slugify(stages[0].name)} />
        <StagesViewSelector stages={stages} />
      </div>
    </>
  );
};

export default Page;
