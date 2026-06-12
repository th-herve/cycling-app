import { ResultSection } from "./components/results-section";
import EventProfile from "./components/profile";
import { getEvent } from "@/lib/events/getEvents";
import { redirect } from "next/navigation";
import { EventHeader } from "./components/event-header";

interface Props {
  params: Promise<{ id: string }>;
}

const SingleDayPage = async ({ params }: Props) => {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event.isSingleDay) {
    redirect(`/event/${event.id}/stages`);
  }

  return (
    <>
      <EventHeader event={event} />
      <div className="mt-10 space-y-20">
        <div>
          <h2 className="mb-2">Profile</h2>
          <div>
            <EventProfile id={event.id} />
          </div>
        </div>
        <div>
          <h2 className="mb-2">Results</h2>
          <ResultSection results={event.results} />
        </div>
      </div>
    </>
  );
};

export default SingleDayPage;
