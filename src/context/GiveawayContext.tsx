"use client";

import {
  GameDataAdmin,
  GetEntryBalanceCombinedResponse,
} from "@/models/game-data.model";
import EntryService from "@/services/EntryService";
import GiveawayService from "@/services/GiveawayService";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const GiveawayContext = createContext<{
  data: GameDataAdmin | undefined;
  missingValues: string[];
  loadingEntries: boolean;
  giveawayLoading: boolean;
}>({ data: undefined, missingValues: [], loadingEntries: true, giveawayLoading: true });

export const useGiveawayContext = () => {
  const context = useContext(GiveawayContext);
  return context;
};

export const GiveawayContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<GameDataAdmin>();
  const [giveaway, setGiveaway] = useState<any>(null); // State for storing giveaway data
  const [urlParams, setUrlParams] = useState<any>(null);
  const [entries, setEntries] =
    useState<GetEntryBalanceCombinedResponse | null>(null);

  const [loadingEntries, setLoadingEntries] = useState(true);
  const [giveawayLoading, setGiveawayLoading] = useState(true);

  const searchParams = useSearchParams();

  const [missingValues, setMissingValues] = useState<string[]>([]);
  // Extract query parameters from the URL and check if any are missing
  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const winUrl = searchParams.get("winUrl");
    const adminUrl = searchParams.get("adminUrl");
    const giveawayId = searchParams.get("giveawayId");
    const extractedParams = {
      accessToken,
      winUrl,
      adminUrl,
      giveawayId,
    };
    const missingValues: string[] = [];
    Object.entries(extractedParams).forEach(([key, value]) => {
      if (!value) {
        missingValues.push(key); // Add missing parameters to the missingValues array
      }
    });
    setMissingValues(missingValues); // Set missing parameters in the state
    setUrlParams(extractedParams); // Set URL parameters in the state
  }, [searchParams]);

  // Fetch giveaway and entries data when URL params are available
  useEffect(() => {
    const fetchGiveaway = async () => {
      if (urlParams?.giveawayId) {
        setGiveawayLoading(true);
        try {
          const response = await GiveawayService.getGiveaway(
            urlParams.accessToken,
            urlParams.winUrl,
            urlParams.giveawayId
          );
          setGiveaway(response); // Store the fetched giveaway data
        } catch (error) {
          console.error("Error fetching giveaway:", error);
        } finally {
          setGiveawayLoading(false);
        }
      }
    };
    const fetchEntries = async () => {
      if (urlParams?.giveawayId) {
        setLoadingEntries(true);
        try {
          const response = await EntryService.getEntries(
            urlParams.accessToken,
            urlParams.adminUrl,
            urlParams.giveawayId
          );
          setEntries(response); // Store the fetched entries data
        } catch (error) {
          console.error("Error fetching entries:", error);
        } finally {
          setLoadingEntries(false);
        }
      }
    };
    fetchGiveaway();
    fetchEntries();
  }, [urlParams]);

  // Once giveaway and entries data are available, prepare the game data for Phaser
  useEffect(() => {
    if (giveaway && entries && urlParams?.accessToken) {
      const gameDataAdmin: GameDataAdmin = {
        type: "DRAW_GIVEAWAY",
        accessToken: urlParams.accessToken!,
        winnerSubmitUrl: `${urlParams.winUrl}/giveaway-winner/create`,
        giveawayId: urlParams.giveawayId!,
        entries: entries?.data,
        giveaway: giveaway,
      };
      setData(gameDataAdmin);
    }
  }, [giveaway, entries, urlParams]);

  return (
    <GiveawayContext.Provider value={{ data, missingValues, loadingEntries, giveawayLoading }}>
      {children}
    </GiveawayContext.Provider>
  );
};
