import DefaultLayout from "@/components/layouts/default-layout";
import { getEvents } from "@/lib/events/getEvents";
import SelectList from "./components/select-list";

const ExportPage = async () => {
  const events = await getEvents(2026, "men");

  return (
    <DefaultLayout>
      <h1>Export</h1>
      <SelectList events={events} />
    </DefaultLayout>
  );
};

export default ExportPage;
