import { cn } from "@/lib/utils";
import { siteRoute } from "@/siteConfig";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaCalendarDay } from "react-icons/fa6";

interface Props {
  className?: string;
}

const Navbar = ({ className }: Props) => {
  return (
    <header>
      <nav
        aria-label="Main navigation"
        className={cn(
          "bg-background flex w-full items-center justify-between py-5",
          className,
        )}
      >
        <div className="flex items-center gap-10">
          <Link href={siteRoute.schedule.calendar}>
            <div className="flex items-center gap-2">
              <Image
                src="/icon"
                alt="Cycling Calendar logo"
                width={32}
                height={32}
              />
              <span className="font-title">Cycling Calendar</span>
            </div>
          </Link>

          <ul className="flex items-center gap-5">
            <li>
              <Link className="font-bold" href={siteRoute.schedule.calendar}>
                Calendar
              </Link>
            </li>
            <li>
              <Link className="font-bold" href={siteRoute.teams.list}>
                Teams
              </Link>
            </li>
          </ul>
        </div>

        <Link href={siteRoute.export.root}>
          <Button variant="outline">
            <FaCalendarDay />
            Export
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
