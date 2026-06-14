import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col h-[90vh] items-center justify-center gap-5">
      <div className="flex items-center justify-center gap-5">
        <h2 className="font-date border-muted-foreground border-r pr-10">
          404
        </h2>
        <p>Could not find requested resource</p>
      </div>
      <Link href="/">Return Home</Link>
    </div>
  );
}
