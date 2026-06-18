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

interface Props {
  value: string;
  variant?: "default" | "secondary";
  onValueChange?: (gender: string) => void;
  disabled?: boolean;
}

const GenderSelectLinks = ({
  value,
  variant = "default",
  onValueChange,
  disabled = false,
}: Props) => {
  const isSecondary = variant === "secondary";

  const nav = useUrlParamsNavigation();

  const handleChange = (newGender: string) => {
    if (onValueChange) {
      onValueChange(newGender);
    } else {
      nav.updateAndPushUrl({ gender: newGender });
    }
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger
        className={cn("min-w-[10ch]", {
          "bg-secondary text-secondary-foreground": isSecondary,
        })}
        aria-label="Select a gender category"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className={cn({
          "text-secondary-foreground bg-secondary": isSecondary,
        })}
      >
        <SelectItem value="men">Men</SelectItem>
        <SelectItem value="women">Women</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default GenderSelectLinks;
