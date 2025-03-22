"use client";

import SlotMachineComponent from "@/components/slot";
import { chooseWinner, useGiveawayContext } from "@/context/GiveawayContext";
import { EntryBalanceCombinedDto } from "@/models/game-data.model";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SlotMachinePage = () => {
  const {
    dataFormatted,
    submitWinner,
    giveawayLoading,
    loadingEntries,
    missingValues,
    isUnauthorized,
  } = useGiveawayContext();
  const [giveawayEntries, setGiveawayEntries] = useState<
    EntryBalanceCombinedDto[]
  >([]);
  useEffect(() => {
    if (dataFormatted) {
      setGiveawayEntries(dataFormatted.entries ?? []);
    }
  }, [dataFormatted]);

  const [winners, setWinners] = useState<EntryBalanceCombinedDto[]>([]);
  const [latestWinner, setLatestWinner] = useState<EntryBalanceCombinedDto>();

  const onSpin = useCallback((): string => {
    const { winner, giveawayEntries: newGiveawayEntries } = chooseWinner(
      giveawayEntries ?? [],
      winners
    );

    const entry = newGiveawayEntries.find((e) => e.userId === winner);
    console.log(entry);
    setGiveawayEntries(newGiveawayEntries);
    if (entry) {
      setLatestWinner(entry);
    }
    return (
      entry?.name ??
      Array(dataFormatted?.maxNameLength ?? 1)
        .fill(" ")
        .join("")
    );
  }, [dataFormatted, giveawayEntries, winners]);
  // Store the entry in a ref to ensure we have access to it in onFinish
  const currentEntryRef = useRef<EntryBalanceCombinedDto | undefined>();

  console.log({ latestWinner });
  const onFinish = useCallback(() => {
    const latestWinner = currentEntryRef.current;
    if (latestWinner) {
      setWinners((prev) => [...prev, latestWinner]);
      submitWinner(dataFormatted!, latestWinner).then(() => {
        setLatestWinner(undefined);
      });
    }
  }, [dataFormatted, submitWinner]);

  // Update the ref when setting latest winner
  useEffect(() => {
    currentEntryRef.current = latestWinner;
  }, [latestWinner]);

  const textLength = useMemo(
    () => dataFormatted?.maxNameLength ?? 0,
    [dataFormatted]
  );
  // Render a message if URL parameters are missing
  if (missingValues.length) {
    return <div>Missing params: {missingValues.join(", ")}</div>;
  } else if (loadingEntries && giveawayLoading) {
    // Render a loading state if giveaway or entries data are still loading
    return <div>Loading...</div>;
  } else if (isUnauthorized) {
    return <div>Unauthorized: Please launch the game again.</div>;
  }

  return (
    <SlotMachineComponent
      key={textLength}
      textLength={textLength}
      onSpin={onSpin}
      onFinish={() => onFinish()}
    />
  );
};

export default SlotMachinePage;
