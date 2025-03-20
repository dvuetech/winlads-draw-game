import { GiveawayDto } from "@/models/game-data.model"; 
  
class GiveawayService {
    async getGiveaway(accessToken: string, url: string, giveawayId: string): Promise<GiveawayDto> {    
        try {
            const updatedUrl = `${url}/giveaways/get-one`;
            const response = await fetch(updatedUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                id: giveawayId,  
                withAttachmentUrl: false,  
              }),
            });
      
            if (!response.ok) {
              throw new Error(response.status as any);
            }
      
            const data = await response.json();
            return data;
          } catch (error) {
            console.error('Failed to fetch giveaway details:', error);
            throw error;
          }
    }
}
  
export default new GiveawayService();
