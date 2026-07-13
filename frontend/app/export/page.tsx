import DefaultLayout from "@/components/layouts/default-layout";
import { getEvents } from "@/lib/events/getEvents";
import SelectList from "./components/select-list";

const ExportPage = async () => {
  const events = await getEvents(2026, "men");

  return (
    <DefaultLayout>
      <h1>Export</h1>
      <p className="text-muted-foreground mb-4">
        Never miss a race by adding them to your online calendar.
        <br /> Get started by selecting the races you want to follow.
      </p>
      <SelectList events={events} />
    </DefaultLayout>
  );
};

export default ExportPage;
