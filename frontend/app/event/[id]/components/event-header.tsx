import CountryIcon from "@/components/common/country-icon";
import Event from "@/types/event";
import { InfoSection } from "./infos-section";
import CanceledLabel from "@/components/common/canceled-label";

export const EventHeader = ({ event }: { event: Event }) => {
  const isCanceled = event.status === "canceled";
  return (
    <>
      <h1 className="flex items-start">
        <CountryIcon
          className="mr-4 pt-1"
          countryCode={event.country?.alpha2 || ""}
          aria-label={event.country?.name}
        />
        {event.name} {event.seasonYear}
      </h1>
      {isCanceled && <CanceledLabel />}
      <InfoSection event={event} />
    </>
  );
};
