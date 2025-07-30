"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { fetchSS13ServerRounds } from "@/lib/api/client/servers";
import { ServerData, SS13Round } from "../../types/server";
import {
  calculateTotalPages,
  formatDate,
  formatRoundDuration,
  getStatusColor,
} from "@/lib/utils";

interface RoundHistoryProps {
  server: ServerData;
}

interface PaginationControlsProps {
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const PaginationControls = ({
  itemsPerPage,
  setItemsPerPage,
  page,
  setPage,
  totalPages,
}: PaginationControlsProps) => {
  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number.parseInt(event.target.value));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="p-4 border-t border-gray-800 flex justify-between items-center">
      <select
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        className="bg-black/40 border border-gray-700 rounded-md p-2 text-white"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>

      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={page === 1}
          className="border-gray-700 hover:bg-gray-800"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </Button>

        <span className="text-gray-400 text-sm mx-2">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="border-gray-700 hover:bg-gray-800"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

const RoundHistory = ({ server }: RoundHistoryProps) => {
  const [rounds, setRounds] = useState<SS13Round[]>([]);
  const [totalRounds, setTotalRounds] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRounds = async () => {
    setLoading(true);
    setError(null);

    try {
      const serverRoundsResponse = await fetchSS13ServerRounds(
        server.id,
        itemsPerPage,
        (page - 1) * itemsPerPage
      );
      const roundsList = serverRoundsResponse.rounds;
      setTotalRounds(serverRoundsResponse.total);

      setTotalPages(
        calculateTotalPages(serverRoundsResponse.total, itemsPerPage)
      );

      const updatedRoundsList = roundsList.map((round, index, array) => {
        const updatedRound = { ...round };
        if (
          updatedRound.end_datetime ||
          updatedRound.shutdown_datetime ||
          updatedRound.end_state
        ) {
          updatedRound.status = "Completed";
        }

        updatedRound.duration = formatRoundDuration(
          updatedRound.start_datetime || updatedRound.initialize_datetime,
          updatedRound.end_datetime || updatedRound.shutdown_datetime
        );

        if (!updatedRound.status) {
          if (updatedRound.initialize_datetime) {
            const startDate = new Date(updatedRound.initialize_datetime);
            const now = new Date();
            const diffInMilliseconds: number =
              now.getTime() - startDate.getTime();
            const diffInHours: number = diffInMilliseconds / (1000 * 60 * 60);

            if (diffInHours > 24) {
              updatedRound.status = "Completed";
              updatedRound.status_note =
                "The difference between now and the start of the round is greater than 24 hours.\nSo we have REASONABLE assumption that the round is over by now.";
            } else if (index > 0) {
              updatedRound.status = "Completed";
              updatedRound.status_note =
                "There's no end time for this round but a new round has started,\nnso it's with reasonable assumption the round has ended";
            }
          } else {
            updatedRound.status = "Unknown";
            updatedRound.status_note =
              "There was no initialization time for this round.";
          }
        }

        return updatedRound;
      });

      setRounds(updatedRoundsList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching round history:", err);
      setError("Failed to load round history. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, [itemsPerPage, page]);

  useEffect(() => {
    setTotalPages(calculateTotalPages(totalRounds, itemsPerPage));
    setPage(1);
  }, [itemsPerPage, totalRounds]);

  return (
    <Card className="bg-black/40 border-0">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-xl text-white">Recent Rounds</CardTitle>
      </CardHeader>
      <PaginationControls
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
      <CardContent className="p-0">
        <div className="relative overflow-x-auto">
          <table className="w-full text-left">
              <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Round #
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Map
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Duration
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? undefined : rounds.map((round) => (
                  <tr
                    key={round.id}
                    className="border-b border-gray-800 hover:bg-black/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {round.id}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tooltip={round.status_note}
                        className={`${getStatusColor(round.status)}`}
                      >
                        {round.status || "Unknown"}{" "}
                        {round.status_note ? (
                          <Info size={12} className="text-primary ml-1" />
                        ) : (
                          ""
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {round.map_name || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {formatDate(
                        round.start_datetime || round.initialize_datetime
                      ) || "Unknown"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={14} className="text-primary" />
                        <span>{round.duration || "Could not determine"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/servers/${server.id}/rounds/${round.id}`}
                        className="text-primary text-sm flex items-center gap-1 hover:underline justify-end"
                      >
                        Details
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          {
            loading ? (
              <div className="p-6 space-y-2">
              {
                Array(itemsPerPage).fill(0).map((x,i)=> 
                   <Skeleton key={i} className="h-[40px] w-full bg-gray-800/50" />
                )
              }
              {/* <Skeleton className="h-14 w-full bg-gray-800/50" />
              <Skeleton className="h-14 w-full bg-gray-800/50" />
              <Skeleton className="h-14 w-full bg-gray-800/50" />
              <Skeleton className="h-14 w-full bg-gray-800/50" />
              <Skeleton className="h-14 w-full bg-gray-800/50" /> */}
            </div>
            ) : undefined
          }
        </div>
        <PaginationControls
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </CardContent>
    </Card>
  );
};

export default RoundHistory;
