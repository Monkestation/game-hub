import type { NextApiRequest, NextApiResponse } from "next";
import { ServerStatsData } from "@/types/server";
import plexoraApiClient from "@/lib/api/server/apiClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await plexoraApiClient.get<ServerStatsData>("/servers/stats");
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching server stats:", error);
    return res.status(500).json({ message: "Failed to fetch server stats" });
  }
}
