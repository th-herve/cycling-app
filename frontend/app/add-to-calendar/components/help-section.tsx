import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FaChevronDown } from "react-icons/fa6";

const HelpSection = () => {
  return (
    <div className="max-w-200">
      <h2 className="mb-4">Help</h2>
      <GoogleHelp />
      <OutlookHelp />
      <ProtonHelp />
    </div>
  );
};

const GoogleHelp = () => (
  <Collapsible>
    <CollapsibleTrigger asChild>
      <Button variant="ghost" className="group w-full text-base">
        Google Calendar
        <FaChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
      </Button>
    </CollapsibleTrigger>

    <CollapsibleContent className="text-muted-foreground px-5">
      If the Google Calendar button doesn&apos;t work, you can subscribe
      manually:
      <ol className="ml-8 list-decimal">
        <li>Open Google Calendar.</li>
        <li>
          Click <Badge variant="outline">+</Badge> next to{" "}
          <Badge variant="outline">Other calendars</Badge>.
        </li>
        <li>
          Select <Badge variant="outline">From URL</Badge>.
        </li>
        <li>Paste the calendar URL above.</li>
        <li>
          Click <Badge variant="outline">Add calendar</Badge>.
        </li>
      </ol>
    </CollapsibleContent>
  </Collapsible>
);
const OutlookHelp = () => (
  <Collapsible>
    <CollapsibleTrigger asChild>
      <Button variant="ghost" className="group w-full text-base">
        Outlook
        <FaChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent className="text-muted-foreground px-5">
      If the Outlook button doesn&apos;t work (which is usually the case if you
      are using the web version), you can subscribe manually:
      <ol className="ml-8 list-decimal">
        <li>Open Outlook Calendar.</li>
        <li>
          Click <Badge variant="outline">Add calendar</Badge>.
        </li>
        <li>
          Click <Badge variant="outline">Subscribe from web</Badge>.
        </li>
        <li>Paste the calendar URL above.</li>
        <li>
          Click <Badge variant="outline">Add import</Badge>.
        </li>
      </ol>
    </CollapsibleContent>
  </Collapsible>
);

const ProtonHelp = () => (
  <Collapsible>
    <CollapsibleTrigger asChild>
      <Button variant="ghost" className="group w-full text-base">
        Proton Calendar
        <FaChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
      </Button>
    </CollapsibleTrigger>

    <CollapsibleContent className="text-muted-foreground px-5">
      For Proton Calendar, you can subscribe manually:
      <ol className="ml-8 list-decimal">
        <li>Open Proton Calendar.</li>
        <li>
          Click <Badge variant="outline">+</Badge> next to{" "}
          <Badge variant="outline">My calendars</Badge>.
        </li>
        <li>
          Select <Badge variant="outline">Add calendar from URL</Badge>.
        </li>
        <li>Paste the calendar URL above.</li>
        <li>
          Click <Badge variant="outline">Add calendar</Badge>.
        </li>
      </ol>
    </CollapsibleContent>
  </Collapsible>
);

export default HelpSection;
