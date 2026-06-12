import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const DefaultLayout = ({ children, className }: Props) => {
  return (
    <ScrollArea className="h-screen">
      <main className="flex flex-col items-center px-2 py-24 md:px-4">
        <div className={cn("w-full max-w-300", className)}>{children}</div>
      </main>
    </ScrollArea>
  );
};

export default DefaultLayout;
