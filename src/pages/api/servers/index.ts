import type { NextApiRequest, NextApiResponse } from "next";
import { ServersResponse, ServerData } from "@/types/server";
import plexoraApiClient from "@/lib/api/server/apiClient";

let serversCache: ServerData[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 60000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const forceRefresh = req.query.refresh === "true";

  try {
    const currentTime = Date.now();

    if (
      !forceRefresh &&
      serversCache.length > 0 &&
      currentTime - lastFetchTime < CACHE_TTL
    ) {
      return res.status(200).json({ servers: serversCache });
    }

    const response = await plexoraApiClient.get<ServerData[]>("/servers");
    serversCache = response.data;
    lastFetchTime = currentTime;

    return res.status(200).json({ servers: serversCache });
  } catch (error) {
    console.error("Error fetching servers:", error, (error as {response:{data:string}}).response.data);

    if (serversCache.length > 0) {
      return res.status(200).json({
        servers: serversCache,
        cached: true,
        lastUpdated: new Date(lastFetchTime).toISOString(),
      });
    }

    return res.status(500).json({ message: "Failed to fetch servers" });
  }
}
