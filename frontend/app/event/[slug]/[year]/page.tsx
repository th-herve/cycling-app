import { notFound, redirect } from "next/navigation";
import { svgManifest } from "@/generated/svg-manifest";
import { EventHeader } from "./components/event-header";
import { Top3Result } from "./components/results-snapshot-section";
import EventProfile from "./components/profile";
import { ResultSection } from "./components/results-section";
import { getEventBySlug } from "@/lib/events/getEvents";

interface Props {
  params: Promise<{ slug: string; year: string }>;
}

const SingleDayPage = async ({ params }: Props) => {
  const { slug, year } = await params;
  const event = await getEventBySlug(slug, year);

  if (!event) {
    notFound();
  }

  if (!event.isSingleDay) {
    redirect(`/event/${event.id}/stages`);
  }

  return (
    <>
      <EventHeader event={event} />
      <div className="mt-10 space-y-10">
        <Top3Result results={event.results} />
        {svgManifest.has(event.id) && (
          <div>
            <h2 className="mb-2">Profile</h2>
            <div>
              <EventProfile id={event.id} />
            </div>
          </div>
        )}
        <div>
          <h2 className="mb-2">Results</h2>
          <ResultSection results={event.results} />
        </div>
      </div>
    </>
  );
};

export default SingleDayPage;
