"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, ServerIcon } from 'lucide-react';
import { ServerData, ServerStatusRaw } from '@/types/server';
import { formatDuration, formatGameState, getStatusColor, getStatusText, imageLookup } from '@/lib/utils';
import { fetchServerStatus } from '../../lib/api/client/servers';

const FeaturedServer = ({ server }: { server: ServerData; }) => {
  const [serverStatus, setServerStatus] = useState<ServerStatusRaw | null>(null)

    useEffect(() => {
      const setTHEServerStatus = async () => {
        setServerStatus(await fetchServerStatus(server));
      }
      
      setTHEServerStatus();
    }, [server])

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-800">
      <div className="relative aspect-video w-full">
        <Image
          src={imageLookup(server.imageKey) || '/images/space-bg.png'}
          alt={server.name}
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="flex items-center gap-3 mb-2">
            {imageLookup(server.iconKey) && (
              <Image
                src={imageLookup(server.iconKey)}
                alt={server.name}
                width={48}
                height={48}
                className="rounded"
              />
            )}
            <div>
              <h2 className="text-white text-3xl font-bold">{server.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`${getStatusColor(serverStatus?.simple.status)} text-white uppercase text-xs`}>
                  {getStatusText(serverStatus?.simple.status)}
                </Badge>
                <span className="text-gray-300 text-sm">•</span>
                <span className="text-gray-300 text-sm">{server.type === 'ss13' ? 'Space Station 13' : server.type}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-4 max-w-3xl">
            {server.description}
          </p>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-white">
              <Users />
              <span>{serverStatus?.status?.obj.players}{serverStatus?.status?.obj.extreme_popcap ? `/${serverStatus?.status?.obj.extreme_popcap}` : ''} players</span>
            </div>

            {serverStatus?.status?.obj.round_duration !== undefined && (
              <div className="flex items-center gap-2 text-white">
                <Clock />
                <span>Round time: {formatDuration(serverStatus?.status?.obj.round_duration)}</span>
              </div>
            )}

            {serverStatus?.status?.obj.map_name && (
              <div className="text-white">
                <span>Map: {serverStatus?.status?.obj.map_name}</span>
              </div>
            )}

            {serverStatus?.status?.obj.gamestate !== undefined && (
              <div className="text-white">
                <span>Status: {formatGameState(serverStatus?.status?.obj.gamestate)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/80">
              <Link href={`/servers/${server.id}`} className="flex items-center gap-2">
                <ServerIcon size={16} />
                <span>View Server Details</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedServer;
