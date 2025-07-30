// Client -> Server
import axios from "axios";
import {
  ServersResponse,
  ServerStatsData,
  ServerData,
  SS13Rounds,
  SS13Round,
  ServerStatusType,
  ServerStatusRaw,
} from "@/types/server";

const apiClientNext = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchServers = async (): Promise<ServerData[]> => {
  try {
    const response = await apiClientNext.get<ServersResponse>("/servers");
    return response.data.servers;
  } catch (error) {
    console.error("Error fetching servers:", error);
    throw error;
  }
};

export const fetchServer = async (
  serverId: string
): Promise<ServerData | null> => {
  try {
    const response = await apiClientNext.get<ServerData>(
      `/servers/${serverId}`
    );
    return response.data;
  } catch (error) {
    if ((error as { response: { status: number } }).response.status === 404) {
      return null;
    } else {
      console.error("Error fetching server:", error);
      throw error;
    }
  }
};

export const fetchServerStats = async (): Promise<ServerStatsData> => {
  try {
    const response = await apiClientNext.get<ServerStatsData>("/servers/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching server stats:", error);
    throw error;
  }
};

export const fetchServerStatus = async (serverOrId: ServerData | string): Promise<ServerStatusRaw | null> => {
  let server = serverOrId as ServerData | null;
  if (typeof serverOrId === "string")
    server = await fetchServer(serverOrId);

  if (!server) return null;
  try {
    const response = await apiClientNext.get<ServerStatusRaw>(
      `/servers/${server.id}/status`,
      {
        params: {
          type: ServerStatusType.RAW,
        },
      }
    );

    const parseDate = (dateString: string | undefined): Date | null => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date; 
    };

    return {
      ...response.data,
      lastrequest: parseDate(response.data.lastrequest as unknown as string),
      status: response.data.status && {
        ...response.data.status,
        timestamp: parseDate(
          response.data.status && response.data.status?.timestamp as unknown as string 
        ) as Date,
      } || undefined,
    };
  } catch (error) {
    console.error("Error fetching server stats:", error);
    throw error;
  }
}

export const refreshServersData = async (): Promise<ServerData[]> => {
  try {
    const response = await apiClientNext.get<ServerData[]>(
      "/servers?refresh=true"
    );
    return response.data;
  } catch (error) {
    console.error("Error refreshing servers data:", error);
    throw error;
  }
};

export const fetchPlayerCountData = async (
  serverId: string,
  options: {
    period: "hour" | "day" | "week" | "month" | "year"
  } | {
    startDate: Date,
    endDate: Date, 
  }
) {
  const response = await apiClientNext.get<
}

// SS13 Only
export const fetchSS13ServerRounds = async (
  serverId: string,
  limit: number = 10,
  offset: number = 0,
  sort: "asc" | "desc" = "desc"
): Promise<SS13Rounds> => {
  try {
    const response = await apiClientNext.get<ServerSS13RoundsResponse>(
      `/servers/${serverId}/rounds`,
      {
        params: { limit, offset, sort },
      }
    );

    return {
      ...response.data,
      rounds: response.data.rounds.map(parseDateKeys) as unknown as SS13Round[],
    };
  } catch (error) {
    console.error("Error fetching server rounds:", error);
    throw error;
  }
};

export const fetchSS13ServerRound = async (
  serverId: string,
  roundId: string
): Promise<SS13Round> => {
  try {
    const response = await apiClientNext.get<ServerSS13RoundResponse>(
      `/servers/${serverId}/rounds/${roundId}`
    );
    return parseDateKeys(response.data) as unknown as SS13Round;
  } catch (error) {
    console.error("Error fetching server round:", error);
    throw error;
  }
};


export const fetchSS13ServerRoundsAroundSpecificRoundID = async (
  serverId: string,
  roundId: string,
  before: number = 5,
  after: number = 5,
  // sort: "asc" | "desc" = "desc"
): Promise<{
  beforeRounds: SS13Round[];
  targetRound: SS13Round;
  afterRounds: SS13Round[];
  total: number;
}> => {
  try {
    const response = await apiClientNext.get(
      `/servers/${serverId}/rounds/${roundId}/position`,
      {
        params: { before, after, /*sort*/ },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching rounds around specific round ID:", error);
    throw error;
  }
};


// OVERCOMPLICATION!!!
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDateKeys = <T extends Record<string, any>>(round: T): T => {
  const dateFields = [
    "initialize_datetime",
    "start_datetime",
    "end_datetime",
    "shutdown_datetime",
  ];

  return Object.fromEntries(
    Object.entries(round).map(([key, value]) => [
      key,
      dateFields.includes(key) ? (value ? new Date(value) : null) : value,
    ])
  ) as T;
};

interface ServerSS13RoundsResponse {
  total: number;
  rounds: ServerSS13RoundResponse[];
}

interface ServerSS13RoundResponse {
  id: number;
  initialize_datetime: string;
  start_datetime: string | null;
  shutdown_datetime: string | null;
  end_datetime: string | null;
  server_port: number;
  commit_hash: string | null;
  game_mode: string | null;
  game_mode_result: string | null;
  end_state: string | null;
  shuttle_name: string | null;
  map_name: string | null;
  station_name: string;
  duration: string;
}