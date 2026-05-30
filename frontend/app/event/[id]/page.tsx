import DefaultLayout from "@/components/layouts/defaultLayout";
import EventPage from "./components/event-page";
import { getEvent } from "@/lib/events/getEvents";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const data = await getEvent(id);

  console.log(data);
  return (
    <DefaultLayout>
      <EventPage event={data} />
    </DefaultLayout>
  );
};

export default Page;
