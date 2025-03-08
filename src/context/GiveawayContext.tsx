"use client";

import {
  EntryBalanceCombinedDto,
  GameDataAdmin,
  GetEntryBalanceCombinedResponse,
} from "@/models/game-data.model";
import EntryService from "@/services/EntryService";
import GiveawayService from "@/services/GiveawayService";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const GiveawayContext = createContext<{
  data: GameDataAdmin | undefined;
  dataFormatted: (GameDataAdmin & { maxNameLength: number }) | undefined;
  missingValues: string[];
  loadingEntries: boolean;
  giveawayLoading: boolean;
  submitWinner: typeof submitWinner;
}>({
  data: undefined,
  dataFormatted: undefined,
  missingValues: [],
  loadingEntries: true,
  giveawayLoading: true,
  submitWinner: async () => false,
});

export const useGiveawayContext = () => {
  const context = useContext(GiveawayContext);
  return context;
};

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Phaser.Math.Between(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function chooseWinner(
  giveawayEntries: EntryBalanceCombinedDto[],
  winners: EntryBalanceCombinedDto[]
): { winner: string; giveawayEntries: EntryBalanceCombinedDto[] } {
  const newObject = [...giveawayEntries];
  const array = newObject.flatMap((item) => {
    if (!winners.some((winner) => winner.userId === item.userId)) {
      return Array(item.points).fill(item.userId) as string[];
    }
    return [];
  });
  shuffleArray(array);
  const randomIndex = Phaser.Math.Between(0, array.length - 1);
  const winner = array[randomIndex];
  const entry = newObject.find((item) => item.userId === winner);
  if (entry) {
    entry.points = entry.points - 1;
  }
  console.log("After Update", newObject);
  return { winner, giveawayEntries: newObject };
}

export function formatNameWithInitials(fullName: string): string {
  if (!fullName) return "John D.";
  const names = fullName.split(" ");

  if (names.length === 1) return names[0];

  // Keep first name and initialize others
  const firstName = names[0];
  const initials = names
    .slice(1)
    .map((name) => `${name?.[0] ?? ""}.`)
    .join(" ");

  return `${firstName} ${initials ?? ""}`.trim();
}

export async function submitWinner(
  gameData: GameDataAdmin,
  winner: EntryBalanceCombinedDto
) {
  if (gameData) {
    const data = axios.post(
      gameData.winnerSubmitUrl,
      {
        giveawayId: gameData!.giveawayId,
        winnerUserIds: [winner.userId], // Send single winner
        // entries: this.gameData!.entries,
        entries: [],
      },
      {
        headers: {
          Authorization: `Bearer ${gameData!.accessToken}`,
        },
      }
    );

    await Promise.all([data]);
    return true;
  }
  return false;
}

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

  const dataFormatted = useMemo(() => {
    if (data) {
      let length = 0;
      const entriesFormatted = data.entries?.map((entry) => {
        const name = formatNameWithInitials(entry.name);
        length = Math.max(length, name.length);
        return {
          ...entry,
          name: name,
        };
      });

      return {
        ...data,
        entries: entriesFormatted,
        maxNameLength: length,
      };
    }
    return undefined;
  }, [data]);

  return (
    <GiveawayContext.Provider
      value={{
        data,
        dataFormatted,
        missingValues,
        loadingEntries,
        giveawayLoading,
        submitWinner,
      }}
    >
      {children}
    </GiveawayContext.Provider>
  );
};
