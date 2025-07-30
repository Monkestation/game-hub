"use client";

import React, { useEffect, useState, version } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Clock,
  ExternalLink,
  Info,
  MapPin,
  Shield,
  Timer,
  History,
  Code
} from 'lucide-react';
import { formatDuration, formatGameState, getStatusColor, getStatusText, imageLookup } from '@/lib/utils';
import RoundHistory from './RoundHistory';
import type { ServerData, ServerStatusRaw } from '../../types/server';
import { fetchServerStatus } from '../../lib/api/client/servers';

const ServerDetail = ({ server }: { server: ServerData }) => {
  const [serverStatus, setServerStatus] = useState<ServerStatusRaw | null>(null)
  useEffect(() => {
    const setTHEServerStatus = async () => {
      setServerStatus(await fetchServerStatus(server));
    }
    
    setTHEServerStatus();
  }, [server])

  const isSS13 = server.type === 'ss13'; 

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-lg border border-gray-800">
        <div className="relative aspect-video md:aspect-[2.5/1] w-full">
          <Image
            src={imageLookup(server.imageKey) || '/images/space-bg.png'}
            alt={server.name}
            fill
            style={{ objectFit: 'cover' }}
            className="brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000aa] via-black/10 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex items-center gap-3 mb-2">
              {server.iconKey && (
                <Image
                  src={imageLookup(server.iconKey)}
                  alt={server.name}
                  width={64}
                  height={64}
                  className="rounded"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold text-white">{server.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`${getStatusColor(serverStatus?.simple.status)} text-white uppercase text-xs`}>
                    {getStatusText(serverStatus?.simple.status)}
                  </Badge>
                  <span className="text-gray-300 text-sm">•</span>
                  <span className="text-gray-300 text-sm">{server.type === 'ss13' ? 'Space Station 13' : server.type}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Button asChild className="bg-primary hover:bg-primary/80">
                <Link href={`/connect/${server.id}`} className="flex items-center gap-2">
                  <span>Connect Now</span>
                  <ExternalLink size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-0 col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info size={20} className="text-primary" />
              About this server
            </h2>
            <p className="text-gray-300" dangerouslySetInnerHTML={{__html: server.description?.replaceAll("\n", "<br>") || "No description"}} />

            {serverStatus?.simple.status === 'down' && serverStatus?.simple.message && (
              <div className="mt-4 p-4 bg-red-950/50 border border-red-800 rounded-md">
                <p className="text-red-300">{serverStatus?.simple.message}</p>
              </div>
            )}

            {serverStatus?.simple.status === 'degraded' && serverStatus?.simple.message && (
              <div className="mt-4 p-4 bg-yellow-950/50 border border-yellow-800 rounded-md">
                <p className="text-yellow-300">{serverStatus?.simple.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-0">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Server Status
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="text-gray-400">Players</span>
                <span className="text-white font-medium">{serverStatus?.status?.obj.players}{serverStatus?.status?.obj.extreme_popcap ? `/${serverStatus?.status?.obj.extreme_popcap}` : ''}</span>
              </div>

              {serverStatus?.status?.obj.map_name && (
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} className="text-primary" />
                    <span>Map</span>
                  </span>
                  <span className="text-white font-medium">{serverStatus?.status?.obj.map_name}</span>
                </div>
              )}

              {serverStatus?.status?.obj.security_level && (
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="flex items-center gap-2 text-gray-400">
                    <Shield size={16} className="text-primary" />
                    <span>Security Level</span>
                  </span>
                  <Badge
                    className={
                      serverStatus?.status?.obj.security_level === 'green' ? 'bg-green-600' :
                      serverStatus?.status?.obj.security_level === 'blue' ? 'bg-blue-600' :
                      serverStatus?.status?.obj.security_level === 'red' ? 'bg-red-600' :
                      serverStatus?.status?.obj.security_level === 'delta' ? 'bg-purple-600' : 'bg-gray-600'
                    }
                  >
                    {serverStatus?.status?.obj.security_level.toUpperCase()}
                  </Badge>
                </div>
              )}

              {serverStatus?.status?.obj.gamestate !== undefined && (
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="flex items-center gap-2 text-gray-400">
                    <History size={16} className="text-primary" />
                    <span>Game State</span>
                  </span>
                  <span className="text-white font-medium">{formatGameState(serverStatus?.status?.obj.gamestate)}</span>
                </div>
              )}

              {serverStatus?.status?.obj.round_id && (
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="flex items-center gap-2 text-gray-400">
                    <Info size={16} className="text-primary" />
                    <span>Round ID</span>
                  </span>
                  <span className="text-white font-medium">{serverStatus?.status?.obj.round_id}</span>
                </div>
              )}

              {serverStatus?.status?.obj.round_duration !== undefined && (
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="flex items-center gap-2 text-gray-400">
                    <Clock size={16} className="text-primary" />
                    <span>Round Duration</span>
                  </span>
                  <span className="text-white font-medium">{formatDuration(serverStatus?.status?.obj.round_duration)}</span>
                </div>
              )}

              {serverStatus?.status?.obj.time_dilation_current !== undefined && (
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="flex items-center gap-2 text-gray-400">
                    <Timer size={16} className="text-primary" />
                    <span>Time Dilation</span>
                  </span>
                  <span className="text-white font-medium">{(serverStatus?.status?.obj.time_dilation_current * 100).toFixed(1)}%</span>
                </div>
              )}

            </div>
          </CardContent>
        </Card>
      </div>

      {/* Round History - Only for SS13 servers */}
      {isSS13 && (
        <RoundHistory server={server} />
      )}
    </div>
  );
};

export default ServerDetail;
