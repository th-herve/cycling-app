"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import { siteRoute } from "@/siteConfig";
import Event from "@/types/event";
import { useParams, useRouter } from "next/navigation";

const StageSelector = ({
  currentSlug,
  stages,
  className,
}: {
  currentSlug: string;
  stages: Event[];
  className?: string;
}) => {
  const router = useRouter();
  const { slug, year } = useParams<{
    slug: string;
    year: string;
  }>();

  const onSelect = (stageSlug: string) => {
    router.replace(siteRoute.event.results(slug, year, stageSlug));
  };

  return (
    <Select onValueChange={onSelect} defaultValue={currentSlug}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          {stages.map((s) => (
            <SelectItem key={slugify(s.name)} value={slugify(s.name)}>
              {s.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StageSelector;
