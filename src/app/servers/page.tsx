"use client";

import { useEffect, useState } from 'react';
import ServerList from '@/components/servers/ServerList';
import ServerStats from '@/components/servers/ServerStats';
import { fetchServers, fetchServerStats } from '@/lib/api/client/servers';
import { ServerData, ServerStatsData } from '@/types/server';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServersPage() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [stats, setStats] = useState<ServerStatsData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServerData = async () => {
      try {
        const serverData = await fetchServers();
        setServers(serverData);

        try {
          const statsData = await fetchServerStats();
          setStats(statsData);
        } catch (error) {
          console.error("Failed to load stats data");
        }
      } catch (error) {
        console.error("Failed to load server data");
      } finally {
        setLoading(false);
      }
    };

    loadServerData();
  }, []);

  return (
    <div className="container mx-auto pt-36 pb-16 space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Our Servers</h1>
        <p className="text-gray-300 text-lg max-w-3xl">
          Browse all available Monkestation servers. Connect to any server and join the fun!
        </p>
      </div>

      <div className="mb-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 bg-gray-800/50" />
            <Skeleton className="h-32 bg-gray-800/50" />
            <Skeleton className="h-32 bg-gray-800/50" />
          </div>
        ) : (
          <ServerStats stats={stats} />
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-64 bg-gray-800/50" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 bg-gray-800/50" />
            <Skeleton className="h-64 bg-gray-800/50" />
            <Skeleton className="h-64 bg-gray-800/50" />
            <Skeleton className="h-64 bg-gray-800/50" />
            <Skeleton className="h-64 bg-gray-800/50" />
          </div>
        </div>
      ) : (
        <ServerList servers={servers} />
      )}
    </div>
  );
}
