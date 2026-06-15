import { siteRoute } from "@/siteConfig";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(siteRoute.schedule.calendar);
}
