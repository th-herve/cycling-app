import DefaultLayout from "@/components/layouts/defaultLayout";
import EventPage from "./components/event-page";
import { getEvent, getStages } from "@/lib/events/getEvents";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const data = await getEvent(id);

  const stages = !data.isSingleDay ? await getStages(id) : undefined;

  return (
    <DefaultLayout>
      <EventPage event={data} stages={stages} />
    </DefaultLayout>
  );
};

export default Page;
