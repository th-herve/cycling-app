import DefaultLayout from "@/components/layouts/default-layout";
import LinkTabs from "./components/link-tabs";
import HelpSection from "./components/help-section";

const AddToCalPage = async () => {
  return (
    <DefaultLayout>
      <h1>Add to calendar</h1>

      <div className="space-y-10">
        <div className="text-muted-foreground">
          <p>Never miss a race by subscribing to the race calendar.</p>
          <ul className="list-disc ml-5">
            <li>No signup required</li>
            <li>Automatically updates</li>
          </ul>
        </div>
        <LinkTabs />
        <HelpSection />
      </div>
    </DefaultLayout>
  );
};

export default AddToCalPage;
