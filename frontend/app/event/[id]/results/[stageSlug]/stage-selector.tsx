"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import Event from "@/types/event";
import { useParams, useRouter } from "next/navigation";

const StageSelector = ({
  currentSlug,
  stages,
}: {
  currentSlug: string;
  stages: Event[];
}) => {
  const router = useRouter();
  const { id } = useParams<{
    id: string;
  }>();

  const onSelect = (slug: string) => {
    router.replace(`/event/${id}/results/${slug}`);
  };

  return (
    <Select onValueChange={onSelect} defaultValue={currentSlug}>
      <SelectTrigger>
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
