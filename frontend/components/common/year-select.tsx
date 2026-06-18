"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUrlParamsNavigation } from "@/lib/hooks/useUrlParamsNavigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/siteConfig";

interface Props {
  value: string;
  variant?: "default" | "secondary";
  onValueChange?: (year: string) => void;
  disabled?: boolean;
}

const YearSelectLinks = ({
  value,
  variant = "default",
  onValueChange,
  disabled = false,
}: Props) => {
  const isSecondary = variant === "secondary";

  const nav = useUrlParamsNavigation();

  const handleChange = (newYear: string) => {
    if (onValueChange) {
      onValueChange(newYear);
    } else {
      nav.updateAndPushUrl({ year: newYear });
    }
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger
        className={cn("min-w-[10ch]", {
          "bg-secondary text-secondary-foreground": isSecondary,
        })}
        aria-label="Select a year"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className={cn({
          "text-secondary-foreground bg-secondary": isSecondary,
        })}
      >
        {siteConfig.availableYears.map((y) => (
          <SelectItem key={y} value={y.toString()}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default YearSelectLinks;
