import { svgManifest } from "@/generated/svg-manifest";

const EventProfile = ({ id }: { id: string }) => {
  if (!svgManifest.has(id)) {
    return null;
  }
  return (
    <img
      src={`/profiles/${id}.svg`}
      alt="Profile"
      className="bg-card rounded-sm w-full"
    />
  );
};

export default EventProfile;
