"use client"
import ImageHideEmpty from "@/components/common/ImageHideEmpty";

const EventProfile = ({ id }: { id: string }) => (
  <ImageHideEmpty
    src={`/profiles/${id}.svg`}
    className="bg-card rounded-sm"
    alt="Profile"
    width={0}
    height={0}
    sizes="100vw"
    style={{ width: "100%", height: "auto" }}
    emptyMessage="No profile available."
  />
);

export default EventProfile;
