"use server";

import { generateFeed } from "../events/feed";

export const getFeedToken = async (slugs: string[]) => {
  const token = await generateFeed(slugs);
  return token;
};
