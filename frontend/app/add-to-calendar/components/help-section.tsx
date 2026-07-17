import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HelpSection = () => {
  return (
    <div>
      <h2 className="mb-4">Help</h2>
      <Tabs defaultValue="google" className="">
        <TabsList variant="line">
          <TabsTrigger className="text-xl" value="google">
            Google calendar
          </TabsTrigger>
          <TabsTrigger className="text-xl" value="outlook">
            Outlook
          </TabsTrigger>
        </TabsList>

        <TabsContent className="text-muted-foreground" value="google">
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
        </TabsContent>

        <TabsContent className="text-muted-foreground" value="outlook">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSection;
