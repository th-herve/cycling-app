"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { eventToIcs, generateIcs } from "@/lib/export/cal-export";
import Event from "@/types/event";
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

  const onExport = () => {
    const ics = generateIcs(eventToIcs(checked));
    console.log(ics);
  };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-5">
      <EventsCard
        title="Select the events."
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
        title="Events to be added to your calendar."
        areChecked
        onChange={onUncheck}
        events={checked}
      />

      <Button
        disabled={isExportDisabled}
        onClick={onExport}
        className="col-span-full"
      >
        Export
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
    <Card className="grow">
      <CardHeader>
        <CardTitle className="border-b border-white/50 pb-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default SelectList;
