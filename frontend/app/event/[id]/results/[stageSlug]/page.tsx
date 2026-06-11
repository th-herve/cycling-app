import { getEvent, getStages } from "@/lib/events/getEvents";
import { TabsSelector } from "../../components/tabs-selector";
import { ResultSection } from "../../components/results-section";
import { slugify } from "@/lib/utils";
import StageSelector from "./stage-selector";

interface Props {
  params: Promise<{ id: string; stageSlug: string }>;
}

const Page = async ({ params }: Props) => {
  const { id, stageSlug } = await params;
  const event = await getEvent(id);
  const stages = await getStages(id);

  const stageID = stages.filter((s) => slugify(s.name) === stageSlug)[0].id;
  const currentStage = await getEvent(stageID);

  const isLastEvent = currentStage.id === stages[stages.length - 1].id;

  // If its the last stage, we need to add the final results that are attach to the main event.
  const results = !isLastEvent
    ? currentStage.results
    : { ...event.results, ...currentStage.results };

  return (
    <div>
      <TabsSelector />
      <StageSelector currentSlug={stageSlug} stages={stages} />
      <ResultSection results={results} />
    </div>
  );
};

export default Page;
