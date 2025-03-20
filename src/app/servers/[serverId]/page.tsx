"use client";

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import ServerDetail from '@/components/servers/ServerDetail';
import ServerCard from '@/components/servers/ServerCard';
import { fetchServer, fetchServers, fetchServerStatus } from '@/lib/api/client/servers';
import { ServerData, ServerStatusRaw } from '@/types/server';

interface ServerPageProps {
  params: Promise<{
    serverId: string;
  }>;
}

export default function ServerPage({ params }: ServerPageProps) {
  const { serverId } = React.use(params);
  const [server, setServer] = useState<ServerData | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatusRaw | null>(null);
  const [similarServers, setSimilarServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServerData = async () => {
      try {
        try {
          const serverData = await fetchServer(serverId);
          setServerStatus(await fetchServerStatus(serverId));
          
          setServer(serverData);
        } catch (error) {
          console.error("Failed to load server details from API");
        }

        try {
          const serversData = await fetchServers();
          const currentServerType = server?.type;
          if (currentServerType) {
            const filteredServers = serversData
              .filter(s => s.id !== serverId && s.type === currentServerType)
              .slice(0, 3);
            setSimilarServers(filteredServers);
          }
        } catch (error) {
          console.error("Failed to load similar servers from API");
        }
      } catch (error) {
        console.error("Failed to load server data", error);
      } finally {
        setLoading(false);
      }
    };

    loadServerData();
  }, [serverId, server?.type]);

  if (loading) {
    return (
      <div className="container mx-auto pt-36 pb-16 space-y-12">
        <Skeleton className="h-[400px] w-full bg-gray-800/50" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] md:col-span-2 bg-gray-800/50" />
          <Skeleton className="h-[300px] bg-gray-800/50" />
        </div>
      </div>
    );
  }

  if (!server) {
    notFound();
  }

  return (
    <div className="container mx-auto pt-36 pb-16 space-y-12">
      <ServerDetail server={server} />

      {similarServers.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">Similar Servers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarServers.map((similarServer) => (
              <ServerCard key={similarServer.id} server={similarServer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
