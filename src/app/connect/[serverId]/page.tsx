"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchServer } from "@/lib/api/client/servers";
import { ServerData, ServerType } from "@/types/server";
import Link from "next/link";
import { Copy, Link as LinkIcon } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ConnectServerProps = {
  params: Promise<{
    serverId: string;
  }>;
};

export default function ConnectPage({ params }: ConnectServerProps) {
  const { serverId } = React.use(params);

  const [server, setServer] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serverId) return;

    const loadServer = async () => {
      try {
        const data = await fetchServer(
          Array.isArray(serverId) ? serverId[0] : serverId
        );
        setServer(data);
      } catch (error) {
        console.error("Error fetching server:", error);
        setServer(null);
      } finally {
        setLoading(false);
      }
    };

    loadServer();
  }, [serverId]);

  if (loading) return <p>Loading...</p>;
  if (!server)
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-4xl font-bold text-white mb-4">Server Not Found</h1>
        <p className="text-gray-400 mb-4">
          We couldn't find the server you're looking for.
        </p>
        <Button className="bg-gray-600 hover:bg-gray-500">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );

  const connectUrl: Record<ServerType, string | null> = {
    byond: `byond://${server.game.host}:${server.game.port}`,
    ss13: `byond://${server.game.host}:${server.game.port}`,
    gmod: `steam://connect/${server.game.host}:${server.game.port}`,
    hl2dm: `steam://connect/${server.game.host}:${server.game.port}`,
    quake2: `quake2://${server.game.host}:${server.game.port}`,
    ut2004: `ut2004://${server.game.host}:${server.game.port}`,
    minecraft: null,
    terraria: null,
  };

  const handleCopy = () => {
    const address =
      server.game.port === 25565
        ? server.game.host
        : `${server.game.host}:${server.game.port}`;
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  return (
    <div className="container mx-auto text-center mt-36 py-10 rounded-lg bg-black/80 shadow-md w-fit">
      <h1 className="text-3xl font-bold text-white mb-6">
        Connect to: {server.name}
      </h1>
      <div className="mb-6">
        {connectUrl[server.type] !== null ? (
          <>
            <p className="text-gray-400 mb-4">
              Click the button below to connect.
            </p>
            <Button
              className="bg-primary hover:bg-primary/80 flex items-center gap-2 mx-auto"
              onClick={() => (window.location.href = connectUrl[server.type]!)}
            >
              <LinkIcon size={18} />
              Connect Now
            </Button>
            <p className="text-gray-400 mt-4">
              Having trouble? Try again or connect manually.
            </p>
            <div className="bg-gray-800 p-3 rounded text-white inline-flex items-center gap-2 mt-2">
              {server.game.host}:{server.game.port}
              <Button
                className="bg-primary hover:bg-primary/80 flex items-center gap-2  mx-auto"
                onClick={handleCopy}
              >
                <Copy size={12} />
              </Button>
            </div>
          </>
        ) : server.type === "minecraft" || server.type === "terraria" ? (
          <>
            <p className="text-gray-400 mb-4">
              Join using the following address:
            </p>
            <div className="bg-gray-800 p-3 rounded text-white inline-flex items-center gap-2 mb-4">
              {server.game.host}:{server.game.port}
            </div>
            <Button
              className="bg-primary hover:bg-primary/80 flex items-center gap-2 mx-auto"
              onClick={handleCopy}
            >
              <Copy size={12} />
              Copy Address
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-400 mb-4">
              We don't have connection details for this game.
            </p>
            <div className="bg-gray-800 p-3 rounded text-white inline-flex items-center gap-2 mb-4">
              {server.game.host}:{server.game.port} ({server.type})
            </div>
          </>
        )}
      </div>
      <div className="mt-6">
        <Button className="bg-gray-600 hover:bg-gray-500">
          <Link href="/" className="text-white">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
