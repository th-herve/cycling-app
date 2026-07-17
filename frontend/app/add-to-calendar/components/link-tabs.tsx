import ClipboardCopy from "@/components/common/clipboard-copy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteRoute } from "@/siteConfig";
import { headers } from "next/headers";
import Link from "next/link";
import { FaApple, FaDownload, FaGoogle } from "react-icons/fa6";

const googleLinkBase = "https://calendar.google.com/calendar/r?cid=";

const LinkTabs = async () => {
  return (
    <Tabs defaultValue="men" className="">
      <TabsList>
        <TabsTrigger value="men">Men</TabsTrigger>
        <TabsTrigger value="women">Women</TabsTrigger>
      </TabsList>
      <TabsContent value="men">
        <Content gender="men" />
      </TabsContent>
      <TabsContent value="women">
        <Content gender="women" />
      </TabsContent>
    </Tabs>
  );
};

const Content = async ({ gender }: { gender: "men" | "women" }) => {
  const h = await headers();
  const host = h.get("host");
  const base = `https://${host}/${siteRoute.calendarFeed[gender]}`;
  const webCal = `webcal://${base}`;
  const googleLink = `${googleLinkBase}${encodeURIComponent(webCal)}`;
  return (
    <>
      <p className="text-muted-foreground">
        Subscribe to the {gender} calendar. Includes WorldTour one-day and stage
        races.
      </p>
      <div className="grid grid-cols-4 gap-10">
        <CalLink link={googleLink} title="Google Calendar">
          <FaGoogle className="size-10" />
        </CalLink>

        <CalLink link={webCal} title="Outlook">
          <Outlook />
        </CalLink>

        <CalLink link={webCal} title="Apple">
          <FaApple className="size-10" />
        </CalLink>

        <CalLink
          link={"/" + siteRoute.calendarFeed[gender]}
          title="Download ics file"
        >
          <FaDownload className="size-10" />
        </CalLink>
      </div>
      <p className="text-muted-foreground mt-4">
        You can also copy the link to subscribe manually. See the help section
        for more details.
      </p>
      <ClipboardCopy content={base} />
    </>
  );
};

export default LinkTabs;

const CalLink = ({
  title,
  children,
  link,
}: {
  title: string;
  children: React.ReactElement;
  link?: string;
}) => {
  return (
    <Link target="_blank" href={link || ""}>
      <div className="bg-secondary flex flex-col items-center gap-2 p-4">
        {children}
        {title}
      </div>
    </Link>
  );
};

const Outlook = () => (
  <svg
    className="size-10"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    fill="#FFFFFF"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <title>file_type_outlook</title>
      <path d="M19.484,7.937v5.477L21.4,14.619a.489.489,0,0,0,.21,0l8.238-5.554a1.174,1.174,0,0,0-.959-1.128Z"></path>
      <path d="M19.484,15.457l1.747,1.2a.522.522,0,0,0,.543,0c-.3.181,8.073-5.378,8.073-5.378V21.345a1.408,1.408,0,0,1-1.49,1.555H19.483V15.457Z"></path>
      <path d="M10.44,12.932a1.609,1.609,0,0,0-1.42.838,4.131,4.131,0,0,0-.526,2.218A4.05,4.05,0,0,0,9.02,18.2a1.6,1.6,0,0,0,2.771.022,4.014,4.014,0,0,0,.515-2.2,4.369,4.369,0,0,0-.5-2.281A1.536,1.536,0,0,0,10.44,12.932Z"></path>
      <path d="M2.153,5.155V26.582L18.453,30V2ZM13.061,19.491a3.231,3.231,0,0,1-2.7,1.361,3.19,3.19,0,0,1-2.64-1.318A5.459,5.459,0,0,1,6.706,16.1a5.868,5.868,0,0,1,1.036-3.616A3.267,3.267,0,0,1,10.486,11.1a3.116,3.116,0,0,1,2.61,1.321,5.639,5.639,0,0,1,1,3.484A5.763,5.763,0,0,1,13.061,19.491Z"></path>
    </g>
  </svg>
);
