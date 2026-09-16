import DefaultLayout from "@/components/layouts/default-layout";
import Link from "next/link";

export default function NotFound() {
  return (
    <DefaultLayout>
      <div className="flex h-[90vh] flex-col items-center justify-center gap-5">
        <div className="flex items-center justify-center gap-5">
          <h2 className="font-date border-muted-foreground border-r pr-10">
            404
          </h2>
          <p>Could not find requested resource</p>
        </div>
        <Link href="/">Return Home</Link>
      </div>
    </DefaultLayout>
  );
}
