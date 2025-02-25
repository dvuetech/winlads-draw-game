"use client";

import SlotMachineComponent from "@/components/slot";
import { useGiveawayContext } from "@/context/GiveawayContext";

const SlotMachinePage = () => {
  const { data } = useGiveawayContext();

  return <SlotMachineComponent data={data} />;
};

export default SlotMachinePage;
