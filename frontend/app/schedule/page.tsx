import { siteRoute } from "@/siteConfig";
import { redirect } from "next/navigation";

const Page = () => {
  redirect(siteRoute.schedule.calendar);
};

export default Page;
