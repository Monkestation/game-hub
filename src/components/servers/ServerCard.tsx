"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Clock, ExternalLink } from "lucide-react";
import type { ServerData, ServerStatusRaw } from "@/types/server";
import {
  formatDuration,
  formatGameState,
  getStatusColor,
  getStatusText,
  imageLookup,
} from "@/lib/utils";
import { fetchServerStatus } from "../../lib/api/client/servers";

interface ServerCardProps {
  server: ServerData;
}

const ServerCard = ({ server }: ServerCardProps) => {
  const [serverStatus, setServerStatus] = useState<ServerStatusRaw | null>(
    null
  );
  useEffect(() => {
    const setTHEServerStatus = async () => {
      setServerStatus(await fetchServerStatus(server));
    };

    setTHEServerStatus();
  }, [server]);

  return (
    <Link href={`/servers/${server.id}`} className="block h-full">
      <Card className="overflow-hidden border-0 bg-black/40 hover:bg-black/60 transition-all group h-full flex flex-col">
        <div className="relative w-full h-32">
          <Image
            src={imageLookup(server.imageKey) || "/images/space-bg.png"}
            alt={server.name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {server.iconKey && (
                <Image
                  src={imageLookup(server.iconKey)}
                  alt={server.name}
                  width={24}
                  height={24}
                  onError={(event) => {
                    // @ts-expect-error Realistically shouldn't fail but oh well.
                    event.target.parentElement.style.display = "none";
                  }}
                  className="rounded"
                />
              )}
              <h3 className="text-white font-bold">{server.name}</h3>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor(
                serverStatus?.simple.status
              )} text-white uppercase text-xs`}
            >
              {getStatusText(serverStatus?.simple.status)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between text-gray-300">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <span>
                  {serverStatus?.status?.obj.players ?? "??"}
                  {serverStatus?.status?.obj.extreme_popcap
                    ? `/${serverStatus?.status?.obj.extreme_popcap}`
                    : ""}{" "}
                  players
                </span>
              </div>

              {serverStatus?.status?.obj.round_duration && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span>
                    {formatDuration(serverStatus?.status?.obj.round_duration)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-gray-300">
              {serverStatus?.status?.obj.map_name && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>{serverStatus?.status?.obj.map_name}</span>
                </div>
              )}

              {serverStatus?.status?.obj.gamestate !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-primary text-sm font-medium">
                    {formatGameState(serverStatus?.status?.obj.gamestate)}
                  </span>
                </div>
              )}
            </div>

            {server.shortDescription && (
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {server.shortDescription}
              </p>
            )}

            <div className="mt-auto pt-3">
              <Link href={`/connect/${server.id}`}>
                <Button className="w-full bg-primary hover:bg-primary/80 flex items-center justify-center gap-2">
                  <span>Connect</span>
                  <ExternalLink size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServerCard;
