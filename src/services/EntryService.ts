import { GetEntryBalanceCombinedResponse } from "@/models/game-data.model"; 
  
class EntryService {
    private entriesCache: Map<
    string,
    {
      data: GetEntryBalanceCombinedResponse;
      timestamp: number;
    }
  > = new Map();

    private CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

    async getEntries(accessToken: string, url: string, giveawayId: string): Promise<GetEntryBalanceCombinedResponse> {
        const cached = this.entriesCache.get(giveawayId);
        const now = Date.now();
    
        // Return cached data if it exists and hasn't expired
        if (cached && now - cached.timestamp < this.CACHE_TTL) {
          return cached.data;
        }
    
        try {
            const updatedUrl = `${url}/entries-balance/get-all-combined`;
            const response = await fetch(updatedUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                giveawayId: giveawayId,
              }),
            });
      
            if (!response.ok) {
              throw new Error(`Failed to fetch all combined entries. Status: ${response.status}`);
            }
      
            const data = await response.json();
            return data;
          } catch (error) {
            console.error('Failed to fetch all combined entries:', error);
            throw error;
          }
        }
  }
  
  export default new EntryService();