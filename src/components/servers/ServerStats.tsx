"use client";

import React from 'react';
import CountUp from 'react-countup';
import { Card, CardContent } from '@/components/ui/card';
import { ServerStatsData } from '@/types/server';
import { Users, Server, Activity } from 'lucide-react';

interface ServerStatsProps {
  stats?: ServerStatsData;
}

const StatItem = ({
  icon,
  title,
  value,
  description
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
}) => (
  <Card className="bg-black/40 border-0">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/20 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
          <p className="text-white text-2xl font-bold">
            <CountUp end={value} duration={2} />
          </p>
          <p className="text-gray-400 text-xs mt-1">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ServerStats = ({ stats }: ServerStatsProps) => {
  const activeServers = stats && stats?.servers_by_status?.alive + stats?.servers_by_status?.degraded;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatItem
        icon={<Users size={24} />}
        title="Total Players"
        value={stats?.total_players || NaN}
        description="Currently playing across all servers"
      />

      <StatItem
        icon={<Server size={24} />}
        title="Servers"
        value={stats?.total_servers || NaN}
        description={`${activeServers} active servers available to play`}
      />

      <StatItem
        icon={<Activity size={24} />}
        title="Status"
        value={stats?.servers_by_status?.alive || NaN}
        description={`${stats?.servers_by_status?.degraded} degraded, ${stats?.servers_by_status?.down} offline`}
      />
    </div>
  );
};

export default ServerStats;
