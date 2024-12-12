export interface GameDataAdmin {
  type: "DRAW_GIVEAWAY";
  accessToken: string;
  winnerSubmitUrl: string;
  giveawayId: string;
  entries: EntryBalanceCombinedDto[];
  giveaway: GiveawayDto;
}

export interface GiveawayDto {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  coverPhoto: string;
  coverPhoto43: string;
  termsAndConditions: string;
  video: string;
}


export interface EntryBalanceCombinedDto {
  userId: string;
  name: string;
  email: string;
  mobileNumber: string;
  points: number;
  balanceIds: string[];
}
