import { cn } from "@/lib/utils";
import { CSSProperties } from "react";
import { FaCircle, FaShirt } from "react-icons/fa6";

interface Props {
  type: "general" | "mountain" | "point" | "young";
  className?: string;
}

const JerseyIcon = ({ type, className }: Props) => {
  if (type === "mountain") {
    return <MountainJerseyIcon className={className} />;
  }

  return (
    <FaShirt
      className={cn(
        "size-5",
        { "text-yellow-400": type === "general" },
        { "text-green-400": type === "point" },
        { "text-white": type === "young" },
        className,
      )}
    />
  );
};

const Dot = ({ style }: { style?: CSSProperties }) => (
  <FaCircle style={style} className="absolute size-0.5 text-red-500" />
);

const MountainJerseyIcon = ({ className }: Omit<Props, "type">) => {
  type DotOffset = [number, number];

  const dots: DotOffset[] = [
    [3, 4.5],
    [3, 13.5],

    [6, 2],
    [6, 16],

    [6, 6],
    [6, 9],
    [6, 12],

    [10, 6],
    [10, 9],
    [10, 12],

    [14, 6],
    [14, 9],
    [14, 12],
  ];

  return (
    <div className="relative">
      <FaShirt className={cn("size-5 text-white", className)} />

      {dots.map(([top, left]) => (
        <Dot style={{ top: top, left: left }} key={`${top}-${left}`} />
      ))}

    </div>
  );
};

export default JerseyIcon;
