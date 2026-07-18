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
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="group w-full text-base">
            Google calendar
            <FaChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="text-muted-foreground px-5">
          If the google calendar link above does not work, you can try
          subscribing manually to the calendars:
          <ol className="ml-8 list-decimal">
            <li>Open google calendar</li>
            <li>
              In the left panel, click the <Badge variant="outline">+</Badge>{" "}
              next to <Badge variant="outline">Other calendars</Badge>
            </li>
            <li>
              Select <Badge variant="outline">From URL</Badge> in the menu
            </li>
            <li>
              In the URL of calendar input, enter the link above. Then click Add
              calendar
            </li>
          </ol>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="group w-full text-base">
            Outlook
            <FaChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="text-muted-foreground px-5">
          If the Outlook link above does not work (which is usually the case if
          you are using the web version), you can try subscribing manually to
          the calendars:
          <ol className="ml-8 list-decimal">
            <li>Open Outlook calendar</li>
            <li>
              In the left panel, click{" "}
              <Badge variant="outline">Add calendar</Badge>
            </li>
            <li>
              In the menu that opens, click{" "}
              <Badge variant="outline">Subscribe from web</Badge>
            </li>
            <li>
              Enter the link above. Then click{" "}
              <Badge variant="outline">Add import</Badge>
            </li>
          </ol>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default HelpSection;
