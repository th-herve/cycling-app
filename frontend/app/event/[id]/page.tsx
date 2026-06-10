import { ResultSection } from "./components/results-section";
import EventProfile from "./components/profile";
import { getEvent } from "@/lib/events/getEvents";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <div>
        <h2 className="mb-2">Profile</h2>
        <div>
          <EventProfile id={event.id} />
        </div>
      </div>
      <div>
        <h2 className="mb-2">Results</h2>
        <ResultSection event={event} />
      </div>
    </>
  );
};

export default SingleDayPage;
