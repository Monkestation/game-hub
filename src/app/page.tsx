"use client";

import { useEffect, useState } from 'react';
import ServerCard from '@/components/servers/ServerCard';
import { ServerData, ServerStatsData } from '@/types/server';
import { fetchServers, fetchServerStats } from '@/lib/api/client/servers';

export default function HomePage() {
  const [servers, setServers] = useState<ServerData[]>();
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
          console.error("Failed to load stats data, using mock data");
        }
      } catch (error) {
        console.error("Error fetching servers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServerData();
  }, []);

  // Todo implement the loading skeleton things on the servers page here
  const byondServers = servers?.filter(server => server.type === 'ss13');
  const otherServers = servers?.filter(server => server.type !== 'ss13');

  return (
    <div className="space-y-16 pt-20 pb-16">
      <section className="relative">
        <div className="container relative z-10 pt-20 mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Monkestation <span className="text-primary">Server Hub</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              View the status of all Monkestation servers. Connect to your preferred server and join the game.
            </p>
          </div>
        </div>
      </section>

      {/* <section className="container mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Server Statistics</h2>
        <ServerStats stats={stats} />
      </section> */}

      <section className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">BYOND Servers</h2>
          <div className="h-[1px] flex-1 bg-gray-800 ml-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {byondServers && byondServers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      </section>

      {/* Other Servers */}
      {otherServers && otherServers.length > 0 && (
        <section className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Other Servers</h2>
            <div className="h-[1px] flex-1 bg-gray-800 ml-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
