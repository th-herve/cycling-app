import DefaultLayout from "@/components/layouts/default-layout";
import { SiProton } from "react-icons/si";
import { FaApple, FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import { siteRoute } from "@/siteConfig";
import { headers } from "next/headers";

const googleLinkBase = "https://calendar.google.com/calendar/r?cid=";

const AddToCalPage = async () => {
  const h = await headers();
  const host = h.get("host");
  const webCal = `webcal://${host}/${siteRoute.calendarFeed.men}`;
  const googleLink = `${googleLinkBase}${encodeURIComponent(webCal)}`;

  return (
    <DefaultLayout>
      <h1>Add to calendar</h1>

      <div className="space-y-10">
        <p className="text-muted-foreground">
          Never miss a race by adding them to your online calendar.
        </p>
        <div>
          <h3>Men calendar</h3>
          <div className="grid grid-cols-4 gap-10">
            <CalLink link={googleLink} title="Google Calendar">
              <FaGoogle className="size-10" />
            </CalLink>

            <CalLink title="Outlook">
              <Outlook />
            </CalLink>

            <CalLink title="Apple">
              <FaApple className="size-10" />
            </CalLink>

            <CalLink title="Proton Calendar">
              <SiProton className="size-10" />
            </CalLink>
          </div>
        </div>

        <div>
          <h3>Women calendar</h3>
          <div className="grid grid-cols-4 gap-10">
            <CalLink title="Google Calendar">
              <FaGoogle className="size-10" />
            </CalLink>

            <CalLink title="Outlook">
              <Outlook />
            </CalLink>

            <CalLink title="Apple">
              <FaApple className="size-10" />
            </CalLink>

            <CalLink title="Proton Calendar">
              <SiProton className="size-10" />
            </CalLink>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

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
    <Link href={link || ""}>
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

export default AddToCalPage;
