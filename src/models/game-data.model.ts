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
  createdAt: string;
  updatedAt: string;
  isEntriesAlreadySaved: boolean;
  hideOnPublic: boolean;
  giveawayType: "MINOR" | "MAJOR";
  description: string;
  coverPhoto: string;
  coverPhoto43: string | null;
  termsAndConditions: string;
  video: string | null;
}


export interface EntryBalanceCombinedDto {
  userId: string;
  name: string;
  email: string;
  mobileNumber: string | null;
  points: number;
  balanceIds: string[];
}

export interface GetEntryBalanceCombinedResponse {
  data: EntryBalanceCombinedDto[];
}

