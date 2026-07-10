import { getStagesBySlug } from "@/lib/events/getEvents";
import { slugify } from "@/lib/utils";
import { siteRoute } from "@/siteConfig";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string; year: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug, year } = await params;

  const stages = await getStagesBySlug(slug, year);

  if (!stages || stages.length <= 0) {
    notFound();
  }

  const stageSlug = slugify(stages[0].name);

  redirect(siteRoute.event.results(slug, year, stageSlug));
};

export default Page;
