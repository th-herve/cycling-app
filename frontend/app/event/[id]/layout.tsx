import DefaultLayout from "@/components/layouts/defaultLayout";
import { getEvent } from "@/lib/events/getEvents";
import { EventHeader } from "./components/event-header";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

const Page = async ({ params, children }: Props) => {
  const { id } = await params;
  const data = await getEvent(id);

  return (
    <DefaultLayout>
      <EventHeader event={data} />
      <div className="mt-10 space-y-20">{children}</div>
    </DefaultLayout>
  );
};

export default Page;
