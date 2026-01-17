import DefaultLayout from "@/components/layouts/defaultLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideFilter } from "lucide-react";

const Loading = () => {
  return (
    <DefaultLayout>
      <div className="flex justify-between">
        <h1>Calendar</h1>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <LucideFilter className="text-primary" size={14} />
            <p>Filters</p>
          </div>
          <Skeleton className="h-9 w-[92.81px]" />
          <Skeleton className="h-9 w-[92.81px]" />
        </div>
        <LoadingListBody />
      </div>
    </DefaultLayout>
  );
};

export default Loading;

export const LoadingListBody = () => (
  <ul className="space-y-4">
    {Array(40)
      .fill(0)
      .map((_, i) => (
        <li key={i}>
          <Skeleton className="h-48.5 w-full rounded-xl md:h-26.5" />
        </li>
      ))}
  </ul>
);
