"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteRoute } from "@/siteConfig";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const TabsSelector = ({
  resultsStageSlug,
}: {
  resultsStageSlug: string;
}) => {
  const pathname = usePathname();
  const { slug, year } = useParams<{
    slug: string;
    year: string;
  }>();

  const currentPage = pathname.includes("/results") ? "results" : "stages";

  return (
    <Tabs className="mb-5" value={currentPage}>
      <TabsList variant="line">
        <TabsTrigger asChild className="text-2xl" value="stages">
          <Link replace href={siteRoute.events.stages(slug, year)}>
            Stages
          </Link>
        </TabsTrigger>
        <TabsTrigger asChild className="text-2xl" value="results">
          <Link
            replace
            href={siteRoute.events.results(slug, year, resultsStageSlug)}
          >
            Results
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
