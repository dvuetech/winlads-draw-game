"use client";

import SlotMachineComponent from "@/components/slot";
import { chooseWinner, useGiveawayContext } from "@/context/GiveawayContext";
import { EntryBalanceCombinedDto } from "@/models/game-data.model";
import { useCallback, useEffect, useMemo, useState } from "react";

const SlotMachinePage = () => {
  const {
    dataFormatted,
    submitWinner,
    giveawayLoading,
    loadingEntries,
    missingValues,
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
    const entry = giveawayEntries.find((e) => e.userId === winner);
    setGiveawayEntries(newGiveawayEntries);
    if (entry) {
      setLatestWinner(entry);
    }
    return entry?.name ?? Array(dataFormatted?.maxNameLength ?? 1).fill(" ").join("");
  }, [dataFormatted, giveawayEntries, winners]);

  const onFinish = useCallback(
    () => {
      if (latestWinner) {
        setWinners((prev) => [...prev, latestWinner]);
        submitWinner(dataFormatted!, latestWinner).then(() => {
          setLatestWinner(undefined);
        });
      }
    },
    [dataFormatted, latestWinner, submitWinner],
  )

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
  }

  return (
    <SlotMachineComponent
      key={textLength}
      textLength={textLength}
      onSpin={onSpin}
      onFinish={onFinish}
    />
  );
};

export default SlotMachinePage;
