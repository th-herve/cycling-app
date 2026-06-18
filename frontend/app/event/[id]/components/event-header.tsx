import CountryIcon from "@/components/common/country-icon";
import Event from "@/types/event";
import { InfoSection } from "./infos-section";

export const EventHeader = ({ event }: { event: Event }) => {
  return (
    <>
      <h1>
        <CountryIcon
          className="mr-4"
          countryCode={event.country?.alpha2 || ""}
          aria-label={event.country?.name}
        />
        {event.name} {event.seasonYear}
      </h1>
      <InfoSection event={event} />
    </>
  );
};
