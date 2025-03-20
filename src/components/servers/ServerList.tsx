"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServerData, ServerType } from '@/types/server';
import ServerCard from './ServerCard';

interface ServerListProps {
  servers: ServerData[];
  featured?: boolean;
}

const ServerList = ({ servers, featured = false }: ServerListProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filteredServers, setFilteredServers] = useState<ServerData[]>(servers || []);

  // filter servers based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredServers(servers || []);
    } else {
      setFilteredServers(servers ? servers.filter(server => server.type === activeTab) : []);
    }
  }, [activeTab, servers]);

  const serverTypes = ["all", ...new Set(servers?.map(server => server.type))];

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-black/40 border border-gray-800">
          {serverTypes.map((type) => (
            <TabsTrigger
              key={type}
              value={type}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {type === "all" ? "All Servers" : formatServerType(type as ServerType)}
            </TabsTrigger>
          ))}
        </TabsList>

        {serverTypes.map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServers?.map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>

            {filteredServers.length === 0 && (
              <div className="text-center py-12 bg-black/40 rounded-lg border border-gray-800">
                <p className="text-gray-400">No servers found for this category.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const formatServerType = (type: ServerType): string => {
  const typeMap: Record<ServerType, string> = {
    'ss13': 'Space Station 13',
    'minecraft': 'Minecraft',
    'gmod': 'Garry\'s Mod',
    byond: 'BYOND',
    hl2dm: 'Half-Life 2: Deathmatch',
    quake2: 'Quake 2',
    ut2004: 'Unreal Tournament 2004',
    terraria: 'Terraria'
  };

  return typeMap[type] || type;
};

export default ServerList;
