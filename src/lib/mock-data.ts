import {
  ServerData,
  ServerStatsData,
  ByondGameState,
  SS13Round
} from "@/types/server";
import { generateStationName } from "./utils";

export const mockServers: ServerData[] = [
  {
    id: "main",
    name: "Monkestation Main",
    group_id: "main",
    group_name: "Monkestation",
    type: "ss13",
    description: "Medium-Rare Roleplay - The main Monkestation experience",
    featured: true,
    game: {
      host: "main.monkestation.com",
      port: 1337,
    },
  },
  {
    id: "mrp2",
    name: "MRP2",
    group_id: "main",
    group_name: "Monkestation",
    type: "ss13",
    description:
      "Medium-Well Roleplay - Our secondary roleplay server for longer projects and better roleplay",
    game: {
      host: "mrp2.monkestation.com",
      port: 1338,
    },
  },
  {
    id: "vanderlin",
    name: "Vanderlin",
    group_id: "main",
    group_name: "Monkestation",
    type: "ss13",
    description: "Dark Medieval Fantasy Roleplay",
    game: {
      host: "vanderlin.monkestation.com",
      port: 1339,
    },
  },
];

export const mockServerStats: ServerStatsData = {
  total_servers: mockServers.length,
  total_players: 58,
  servers_by_status: {
    alive: 2,
    degraded: 1,
    down: 0
  }
};

export const getMockSS13Round = (roundId = 12350) => {
  const randomBool = () => Math.random() > 0.5;
  const randomDuration = () =>
    `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`;

  const mockRound: SS13Round = {
    id: roundId,
    initialize_datetime: new Date(Date.now() - 5000000),
    start_datetime: new Date(Date.now() - 4800000),
    shutdown_datetime: randomBool() ? new Date(Date.now() - 1000000) : null,
    end_datetime: randomBool() ? new Date(Date.now() - 2000000) : null,
    server_port: 3121,
    commit_hash: Math.random().toString(36).substring(2, 10),
    game_mode: randomBool() ? "Extended" : "Traitor",
    game_mode_result: randomBool() ? "Extended" : "Traitor",
    end_state: randomBool() ? "Normal Shift End" : null,
    shuttle_name: randomBool() ? "Emergency Shuttle" : "Luxury Escape Pod",
    map_name: [
      "DeltaStation",
      "MetaStation",
      "BoxStation",
      "KiloStation",
      "LeadPoisoningStation",
    ][Math.floor(Math.random() * 5)],
    station_name: generateStationName(),
    duration: roundId === 12350 ? "1h 0m" : randomDuration(),
    status: "Ongoing"
  };

  return mockRound;
};
