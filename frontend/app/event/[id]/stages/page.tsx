import { getStages } from "@/lib/events/getEvents";
import { StagesViewSelector } from "../components/stages-section";
import { TabsSelector } from "../components/tabs-selector";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const stages = await getStages(id);

  return (
    <div>
      <TabsSelector />
      <StagesViewSelector stages={stages} />
    </div>
  );
};

export default Page;
