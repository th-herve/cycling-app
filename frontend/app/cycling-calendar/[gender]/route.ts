import { getFeed } from "@/lib/events/getFeeds";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/cycling-calendar/[gender]">,
) {
  const { gender } = await ctx.params;

  const feed = await getFeed(gender);

  return new Response(feed, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
    },
  });
}
