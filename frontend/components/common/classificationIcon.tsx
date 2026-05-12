import { cn } from "@/lib/utils";
import { FaMound, FaStopwatch, FaMinus } from "react-icons/fa6";
import { BsTriangleFill } from "react-icons/bs";
import Classification from "@/types/classification";

interface Props {
  classification?: Classification;
  className?: string;
  size?: number;
}

const ClassificationIcon = ({
  classification,
  className,
  size = 15,
}: Props) => {
  if (!classification) {
    return null;
  }

  let icon;

  switch (classification) {
    case Classification.HILLY:
      icon = <FaMound className="text-yellow-400" size={size} />;
      break;
    case Classification.MEDIUM_MOUNTAIN:
      icon = <FaMound className="text-red-400" size={size} />;
      break;
    case Classification.HIGH_MOUNTAIN:
      icon = <BsTriangleFill className="text-red-400" size={size} />;
      break;
    case Classification.TT:
      icon = <FaStopwatch className="text-blue-400" size={size} />;
      break;
    case Classification.TTT:
      icon = <FaStopwatch className="text-blue-400" size={size} />;
      break;
    case Classification.PROLOGUE:
      icon = <FaStopwatch className="text-blue-400" size={size} />;
      break;
    case Classification.FLAT:
      icon = <FaMinus className="text-green-400" size={size} />;
      break;
  }

  // Return an invisible div if there is no icon
  // so that the space where the icon would go is still filled.
  if (!icon) {
    return (
      <div className={cn("bg-secondary invisible rounded-full p-2", className)}>
        <FaMinus className="" size={size} />
      </div>
    );
  }

  return (
    <div className={cn("bg-secondary inline-flex rounded-full p-2", className)}>
      {icon}
    </div>
  );
};

export default ClassificationIcon;
