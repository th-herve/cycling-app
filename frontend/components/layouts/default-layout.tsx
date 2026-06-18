import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import Navbar from "../common/navbar";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const DefaultLayout = ({ children, className }: Props) => {
  return (
    <ScrollArea className="h-screen">
      <main
        className={cn("mx-auto w-full max-w-300 px-2 pb-24 md:px-4", className)}
      >
        <Navbar className="mb-4" />
        {children}
      </main>
    </ScrollArea>
  );
};

export default DefaultLayout;
