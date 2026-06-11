"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const TabsSelector = () => {
  const pathname = usePathname();
  const { id } = useParams<{
    id: string;
  }>();

  const currentPage = pathname.includes("/results") ? "results" : "stages";

  return (
    <Tabs
      className="mb-5"
      value={currentPage}
    >
      <TabsList variant="line">
        <TabsTrigger asChild className="text-2xl" value="stages">
          <Link href={`/event/${id}/stages`}>Stages</Link>
        </TabsTrigger>
        <TabsTrigger asChild className="text-2xl" value="results">
          <Link href={`/event/${id}/results`}>Results</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
