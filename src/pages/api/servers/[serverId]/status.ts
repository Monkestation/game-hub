import type { NextApiRequest, NextApiResponse } from "next";
import { ServerStatusRaw, ServerStatusSimple } from "@/types/server";
import plexoraApiClient from "@/lib/api/server/apiClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { serverId, type } = req.query;

  if (!serverId || Array.isArray(serverId)) {
    return res.status(400).json({ message: "Invalid server ID" });
  }

  try {
    const response = await plexoraApiClient.get<
      ServerStatusRaw | ServerStatusSimple
    >(`/servers/${serverId}/status`, {
      params: {
        type,
      }
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error fetching server details for ${serverId}:`, error);
    return res.status(500).json({ message: "Failed to fetch server details" });
  }
}
