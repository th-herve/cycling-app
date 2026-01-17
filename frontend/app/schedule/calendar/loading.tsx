import DefaultLayout from "@/components/layouts/defaultLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const weekDayNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const Loading = () => {
  return (
    <DefaultLayout className="max-w-500">
      <div className="flex max-w-500 flex-col">
        <h1>Calendar</h1>
        <div className="space-y-2">
          <div className="flex h-9">
            <Skeleton className="bg-secondary w-40 rounded-full" />
          </div>

          <LoadingCalendarBody />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Loading;

export const LoadingCalendarBody = () => (
  <Card className="w-full p-0">
    <CardContent className="space-y-2 p-0">
      <div className="grid grid-cols-7 gap-4 p-0">
        {weekDayNames.map((name) => (
          <p className="font-date text-center capitalize" key={name}>
            {name}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 p-0 md:gap-4">
        {Array(35)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="h-27 px-3 py-1 md:h-35 md:rounded-xl"
            />
          ))}
      </div>
    </CardContent>
  </Card>
);
