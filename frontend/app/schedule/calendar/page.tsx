import DefaultLayout from "@/components/layouts/defaultLayout";
import CalendarView from "./components/calendar-view";
import ViewSelector from "@/components/common/view-selector";
import { parseEventSearchParams } from "@/lib/events/parseEventsSearchParams";
import { getEvents } from "@/lib/events/getEvents";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const Page = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const { year, gender } = parseEventSearchParams(params);

  const data = await getEvents(year, gender);

  return (
    <DefaultLayout className="max-w-500">
      <div className="flex justify-between">
        <h1>Calendar</h1>
        <ViewSelector currentView="calendar" year={year} gender={gender} />
      </div>
      <CalendarView data={data} year={year} gender={gender} />
    </DefaultLayout>
  );
};

export default Page;
