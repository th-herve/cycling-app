import DefaultLayout from "@/components/layouts/default-layout";
import LinkTabs from "./components/link-tabs";
import HelpSection from "./components/help-section";

const AddToCalPage = async () => {
  return (
    <DefaultLayout>
      <h1>Add to calendar</h1>

      <div className="space-y-10">
        <p className="text-muted-foreground">
          Never miss a race by adding them to your online calendar. No signup
          required.
        </p>
        <LinkTabs />
        <HelpSection />
      </div>
    </DefaultLayout>
  );
};

export default AddToCalPage;
