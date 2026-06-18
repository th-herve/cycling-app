import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const CanceledLabel = ({ className }: Props) => {
  return (
    <p className={cn("text-destructive font-bold", className)}>
      Canceled
    </p>
  );
};

export default CanceledLabel;
