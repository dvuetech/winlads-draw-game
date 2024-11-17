export interface GameDataAdmin {
  type: "DRAW_GIVEAWAY";
  accessToken: string;
  winnerSubmitUrl: string;
  giveawayId: string;
  entries: EntryBalanceCombinedDto[];
}

export interface EntryBalanceCombinedDto {
  userId: string;
  name: string;
  email: string;
  mobileNumber: string;
  points: number;
  balanceIds: string[];
}
