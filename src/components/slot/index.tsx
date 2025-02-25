import { GameDataAdmin } from "@/models/game-data.model";
import SlotMachine from "./SlotMachine";

export interface SlotMachineComponentProps {
  data?: GameDataAdmin;
}

const SlotMachineComponent = ({ data }: SlotMachineComponentProps) => {
  return (
    <div>
      <SlotMachine />
    </div>
  );
};
export default SlotMachineComponent;
