import DefaultLayout from "@/components/layouts/defaultLayout";
import ListView from "./components/list-view";
import ViewSelector from "@/components/common/view-selector";
import { parseEventSearchParams } from "@/lib/events/parseEventsSearchParams";
import { getEvents } from "@/lib/events/getEvents";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const { year, gender } = parseEventSearchParams(params);

  const data = await getEvents(year, gender);

  return (
    <DefaultLayout>
      <div className="flex justify-between">
        <h1>Calendar</h1>
        <ViewSelector currentView="list" year={year} gender={gender} />
      </div>
      <ListView data={data} year={year} gender={gender} />
    </DefaultLayout>
  );
};

export default Page;
