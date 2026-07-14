"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFeedToken } from "@/lib/actions/generate-feed";
import { siteRoute } from "@/siteConfig";
import Event from "@/types/event";
import { redirect } from "next/navigation";
import { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

interface Props {
  events: Event[];
}

const SelectList = ({ events }: Props) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const checked = events.filter((e) => selectedIds.has(e.id));
  const notChecked = events.filter((e) => !selectedIds.has(e.id));

  const onCheck = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };
  const onUncheck = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const onCheckAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      events.forEach((e) => next.add(e.id));
      return next;
    });
  };
  const onUncheckAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.clear();
      return next;
    });
  };

  const isExportDisabled = checked.length <= 0;

  const onExport = async () => {
    const slugs = checked.map((e) => e.slug);
    const token = await getFeedToken(slugs);

    redirect(siteRoute.export.token(token));
  };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-5">
      <EventsCard
        title="Select the races."
        onChange={onCheck}
        events={notChecked}
      />

      <div className="flex flex-col justify-center gap-10">
        <Button variant="outline" onClick={onCheckAll}>
          <FaAnglesRight />
        </Button>
        <Button variant="outline" onClick={onUncheckAll}>
          <FaAnglesLeft />
        </Button>
      </div>

      <EventsCard
        title="Races to be added to your calendar."
        areChecked
        onChange={onUncheck}
        events={checked}
      />

      <Button
        disabled={isExportDisabled}
        onClick={onExport}
        className="col-span-full"
      >
        Continue
      </Button>
    </div>
  );
};

const EventsCard = ({
  events,
  onChange,
  areChecked = false,
  title,
}: {
  events: Event[];
  onChange: (id: string) => void;
  areChecked?: boolean;
  title: string;
}) => {
  return (
    <Card>
      <CardHeader className="border-muted-foreground border-b">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea variant="secondary" className="h-150">
          <ul>
            {events.map((event) => (
              <li
                className="cursor-pointer"
                onClick={() => onChange(event.id)}
                key={`event-${event.id}`}
              >
                <Checkbox checked={areChecked} className="mr-2" />
                {event.name}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SelectList;
