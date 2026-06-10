import { getStages } from "@/lib/events/getEvents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultView, ViewSelector } from "../components/stages-section";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const stages = await getStages(id);

  return (
    <Tabs defaultValue="stages">
      <TabsList variant="line">
        <TabsTrigger value="stages">Stages</TabsTrigger>
        <TabsTrigger value="result">Results</TabsTrigger>
      </TabsList>
      <TabsContent value="stages">
        <ViewSelector stages={stages} />
      </TabsContent>
      <TabsContent value="result">
        <ResultView stages={stages} />
      </TabsContent>
    </Tabs>
  );
};

export default Page;
