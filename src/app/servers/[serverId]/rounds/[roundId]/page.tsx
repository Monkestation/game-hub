"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  Calendar,
  User,
  MapPin,
  Flag,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import {
  fetchServer,
  fetchSS13ServerRound,
  fetchSS13ServerRoundsAroundSpecificRoundID,
} from "@/lib/api/client/servers";
import { ServerData, SS13Round, SS13Rounds } from "@/types/server";
import { formatDate, formatRoundDuration } from "../../../../../lib/utils";

interface RoundDetailPageProps {
  params: Promise<{
    serverId: string;
    roundId: string;
  }>;
}

export default function RoundDetailPage({ params }: RoundDetailPageProps) {
  const { serverId, roundId } = React.use(params);
  const [round, setRound] = useState<SS13Round | null>(null);
  const [server, setServer] = useState<ServerData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoundDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        setServer(await fetchServer(serverId));
        const roundResponse = await fetchSS13ServerRound(serverId, roundId);

        roundResponse.duration = formatRoundDuration(
          roundResponse.start_datetime || roundResponse.initialize_datetime,
          roundResponse.end_datetime || roundResponse.shutdown_datetime
        );

        const surroundingRounds =
          await fetchSS13ServerRoundsAroundSpecificRoundID(
            serverId,
            roundId,
            3,
            3
          );
        const afterRounds = surroundingRounds.afterRounds;

        if (afterRounds.length > 1 || afterRounds.length === 1) {
          roundResponse.status = "Completed";
        } else {
          roundResponse.status = "Ongoing";
        }

        if (
          roundResponse?.end_datetime ||
          roundResponse?.shutdown_datetime ||
          roundResponse?.end_state
        ) {
          roundResponse.status = "Completed";
        }

        if (!roundResponse.status) {
          if (roundResponse.start_datetime) {
            const startDate = new Date(roundResponse.start_datetime);
            const now = new Date();
            const diffInMilliseconds: number =
              now.getTime() - startDate.getTime();
            const diffInHours: number = diffInMilliseconds / (1000 * 60 * 60);

            if (diffInHours > 24) {
              roundResponse.status = "Completed";
              roundResponse.status_note = "FILLMEINLATER";
            }
          }
        }

        setRound(roundResponse);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching round details for ${roundId}:`, err);
        setError("Failed to load round details. Please try again later.");
        setLoading(false);
      }
    };

    fetchRoundDetails();
  }, [serverId, roundId]);

  if (loading) {
    return (
      <div className="container mx-auto pt-36 pb-16 space-y-6">
        <div className="flex items-center gap-2 mb-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-gray-700 hover:bg-gray-800"
          >
            <Link href={`/servers/${serverId}`}>
              <ChevronLeft size={16} className="mr-1" />
              Back to Server
            </Link>
          </Button>
        </div>

        <Skeleton className="h-[60px] w-full sm:w-1/2 bg-gray-800/50 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] bg-gray-800/50" />
          <Skeleton className="h-[300px] bg-gray-800/50" />
        </div>
      </div>
    );
  }

  if (error || !round) {
    return (
      <div className="container mx-auto pt-36 pb-16 space-y-6">
        <div className="flex items-center gap-2 mb-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-gray-700 hover:bg-gray-800"
          >
            <Link href={`/servers/${serverId}`}>
              <ChevronLeft size={16} className="mr-1" />
              Back to Server
            </Link>
          </Button>
        </div>

        <Card className="bg-black/40 border-0">
          <CardContent className="p-6 text-center">
            <AlertTriangle size={48} className="text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Error Loading Round
            </h2>
            <p className="text-gray-400">
              {error || "Round information could not be found."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-36 pb-16 space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-gray-700 hover:bg-gray-800"
        >
          <Link href={`/servers/${serverId}`}>
            <ChevronLeft size={16} className="mr-1" />
            Back to Server
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">
              {server?.name} - Round #{round.id}
            </h1>
            <Badge
              className={
                round.status === "Ongoing" ? "bg-green-600" : "bg-gray-600"
              }
            >
              {round.status}
            </Badge>
          </div>
          <p className="text-gray-400 mt-2">
            {round.map_name}
            {round.station_name ? ` •  ${round.station_name}` : ""}
          </p>
        </div>

        {round.duration && (
          <div className="flex items-center gap-2 text-gray-300">
            <Clock size={20} className="text-primary" />
            <span className="text-xl font-medium">{round.duration}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-0">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-xl text-white">
              Round Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} className="text-primary" />
                  <span>Started</span>
                </span>
                <span className="text-white">
                  {formatDate(round.start_datetime) || "Unknown"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} className="text-primary" />
                  <span>Ended</span>
                </span>
                <span className="text-white">
                  {formatDate(round.end_datetime) || "Unknown"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2 text-gray-400">
                  <User size={16} className="text-primary" />
                  <span>Game Mode</span>
                </span>
                <span className="text-white">
                  {round.game_mode || "Unknown"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2 text-gray-400">
                  <User size={16} className="text-primary" />
                  <span>Game Mode Result</span>
                </span>
                <span className="text-white">
                  {round.game_mode_result || "Unknown"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2 text-gray-400">
                  <Flag size={16} className="text-primary" />
                  <span>End State</span>
                </span>
                <span className="text-white">{round.end_state || "N/A"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-gray-400">
                  <MapPin size={16} className="text-primary" />
                  <span>Map</span>
                </span>
                <span className="text-white">
                  {round.map_name || "Unknown"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-0">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-xl text-white">
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} className="text-primary" />
                  <span>Initialize Time</span>
                </span>
                <span className="text-white">
                  {formatDate(round.initialize_datetime)}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} className="text-primary" />
                  <span>Shutdown Time</span>
                </span>
                <span className="text-white">
                  {formatDate(round.shutdown_datetime)}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2 text-gray-400">
                  <ShieldAlert size={16} className="text-primary" />
                  <span>Shuttle Name</span>
                </span>
                <span className="text-white">
                  {round.shuttle_name || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2 text-gray-400">
                  <MapPin size={16} className="text-primary" />
                  <span>Station Name</span>
                </span>
                <span className="text-white">
                  {round.station_name || "Unknown"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-gray-400">
                  <Code size={16} className="text-primary" />
                  <span>Commit Hash</span>
                </span>
                <span className="text-white font-mono text-sm">
                  {round.commit_hash || "Unknown"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// code icon from lucide-react
const Code = ({ size, className }: { size: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
