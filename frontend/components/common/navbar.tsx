import { cn } from "@/lib/utils";
import { siteRoute } from "@/siteConfig";
import Image from "next/image";
import Link from "next/link";

interface Props {
  className?: string;
}

const Navbar = ({ className }: Props) => {
  return (
    <div
      className={cn("bg-background flex w-full items-center py-5 gap-10", className)}
    >
      <Link href={siteRoute.schedule.calendar}>
        <div className="flex items-center gap-2">
          <Image src="/icon" alt="icon" width={32} height={32} />
          <p className="font-title">Cycling Calendar</p>
        </div>
      </Link>

      <div className="flex items-center gap-5">
        <Link className="font-bold" href={siteRoute.schedule.calendar}>Calendar</Link>
        <Link className="font-bold" href={siteRoute.team.list}>Teams</Link>
      </div>
    </div>
  );
};

export default Navbar;
