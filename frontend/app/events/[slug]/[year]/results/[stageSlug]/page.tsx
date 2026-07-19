import {
  getEvent,
  getEventBySlug,
  getStagesBySlug,
} from "@/lib/events/getEvents";
import { slugify } from "@/lib/utils";
import StageSelector from "./stage-selector";
import { notFound, redirect } from "next/navigation";
import { siteRoute } from "@/siteConfig";
import { ArrowRight } from "lucide-react";
import Event from "@/types/event";
import ClassificationIcon from "@/components/common/classification-icon";
import { EventHeader } from "../../components/event-header";
import { TabsSelector } from "../../components/tabs-selector";
import { ResultSection } from "../../components/results-section";
import { ResultsSnapshotSection } from "../../components/results-snapshot-section";

interface Props {
  params: Promise<{ slug: string; year: string; stageSlug: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug, year, stageSlug } = await params;
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

  // Look for the requested stage from the url stage slug.
  const requestedStage = stages.filter((s) => slugify(s.name) === stageSlug);

  // If there is no stage found, redirect to the first stage result.
  if (requestedStage.length < 1) {
    redirect(siteRoute.events.results(slug, year, slugify(stages[0].name)));
  }

  const stageID = requestedStage[0].id;

  const currentStage = await getEvent(stageID);

  if (!currentStage) {
    notFound();
  }

  const isLastEvent = currentStage.id === stages[stages.length - 1].id;

  // If its the last stage, we need to add the final results that are attach to the main event.
  const results = !isLastEvent
    ? currentStage.results
    : { ...event.results, ...currentStage.results };

  return (
    <>
      <EventHeader event={event} />
      <div className="mt-10 space-y-10">
        <ResultsSnapshotSection event={event} stages={stages} />
        <TabsSelector resultsStageSlug={slugify(stages[0].name)} />
        <div>
          <div className="mb-2 flex items-center gap-6">
            <StageSelector
              className="min-w-27"
              currentSlug={stageSlug}
              stages={stages}
            />
            <StageInfo stage={currentStage} />
          </div>
          <ResultSection results={results} />
        </div>
      </div>
    </>
  );
};

const StageInfo = ({ stage }: { stage: Event }) => {
  return (
    <dl className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <dt className="sr-only">Classification</dt>
        <dd>
          <ClassificationIcon
            classification={stage.classification}
            aria-label={stage.classification}
          />
        </dd>
      </div>

      <div className="hidden items-center gap-1 md:flex">
        <dt className="sr-only">Route</dt>
        <dd className="flex items-center">
          {stage.departureCity}
          {stage.arrivalCity && (
            <>
              <ArrowRight className="mx-1 size-4" aria-hidden="true" />
              {stage.arrivalCity}
            </>
          )}
        </dd>
      </div>

      <div>
        <dt className="sr-only">Distance</dt>
        <dd>
          {stage.distance} {stage.distanceUnit}
        </dd>
      </div>
    </dl>
  );
};

export default Page;
