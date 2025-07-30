export type ServerType = "byond" | "ss13" | "gmod" | "hl2dm" | "quake2" | "ut2004" | "minecraft" | "terraria";

export type ServerStatus = 'alive' | 'degraded' | 'down';

export interface ServerStatusData {
  status: ServerStatus;
  players: number;
  max_players?: number | null;
  map?: string;
  round_id?: string;
  gamestate?: number;
  round_duration?: number;
  time_dilation_current?: number;
  time_dilation_avg?: number;
  security_level?: string;
  version?: string;
  message?: string;
}

export interface ServerData {
  id: string;
  name: string;
  group_id: string;
  group_name: string;
  type: ServerType;
  shortDescription?: string;
  description?: string;
  featured?: boolean;
  imageKey?: string | string[];
  iconKey?: string;
  game: {
    host: string;
    port: number;
  }
}

export interface ServerStatsData {
  total_servers: number;
  total_players: number;
  servers_by_status: {
    alive: number;
    degraded: number;
    down: number;
  };
}

export interface ServersResponse {
  servers: ServerData[];
}

export interface SS13Rounds {
  total: number;
  rounds: SS13Round[],
}

export interface SS13Round {
  id: number;
  initialize_datetime: Date;
  start_datetime: Date | null;
  shutdown_datetime: Date | null;
  end_datetime: Date | null;
  server_port: number;
  commit_hash: string | null;
  game_mode: string | null;
  game_mode_result: string | null;
  end_state: string | null;
  shuttle_name: string | null;
  map_name: string | null;
  station_name: string;
  duration: string | null;
  // added on by our client
  status: 'Ongoing' | 'Completed' | string;
  status_note?: string;
}

export enum ServerStatusType {
  SIMPLE = "simple",
  RAW = "raw",
}

export enum ServerStatusSimpleStatus {
  ALIVE = "alive",
  DEGRADED = "degraded",
  DOWN = "down",
}

export interface ServerStatusSimple {
  status: ServerStatusSimpleStatus;
  message?: string;
}


export type ServerStatusRaw = {
  lastrequest: Date | null;
  simple: ServerStatusSimple;
  status?: {
    obj: SS13ServerTopicStatus;
    timestamp: Date;
  };
};

export type SS13ServerTopicStatus = {
  version: string;
  respawn: boolean;
  enter: boolean;
  ai: boolean;
  host: string;
  round_id: string;
  players: number;
  revision: string;
  revision_date: Date | undefined;
  hub: boolean;
  admins: number;
  gamestate: ByondGameState;
  map_name: string;
  security_level: ByondSecurityLevel;
  round_duration: number;
  time_dilation_current: number;
  time_dilation_avg: number;
  time_dilation_avg_slow: number;
  time_dilation_avg_fast: number;
  soft_popcap: number;
  hard_popcap: number;
  extreme_popcap: number;
  popcap: number | undefined;
  bunkered: boolean;
  interviews: number;
  shuttle_mode?: SS13ShuttleMode;
  shuttle_timer?: number;
  shuttle_emergency_reason?: string;
};

export interface ServerStatusSimple {
  status: ServerStatusSimpleStatus;
  message?: string;
}

export enum ByondGameState {
  GAME_STATE_STARTUP = 0,
  GAME_STATE_PREGAME = 1,
  GAME_STATE_SETTING_UP = 2,
  GAME_STATE_PLAYING = 3,
  GAME_STATE_FINISHED = 4,
}

export enum ByondSecurityLevel {
  GREEN = "green",
  BLUE = "blue",
  RED = "red",
  DELTA = "delta",
}

export enum SS13ShuttleMode {
  SHUTTLE_IDLE = "idle",
  SHUTTLE_IGNITING = "igniting",
  SHUTTLE_RECALL = "recalled",
  SHUTTLE_CALL = "called",
  SHUTTLE_DOCKED = "docked",
  SHUTTLE_STRANDED = "stranded",
  SHUTTLE_DISABLED = "disabled",
  SHUTTLE_ESCAPE = "escape",
  SHUTTLE_ENDGAME = "endgame: game over",
  SHUTTLE_RECHARGING = "recharging",
  SHUTTLE_PREARRIVAL = "landing",
}