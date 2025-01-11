import "phaser";
import Phaser, { Game as GameType } from "phaser";
import { useEffect, useState } from "react";
import PreloadScene from "./scenes/preloadScene";
import MainScene from "./scenes/MainScene";
import { useSearchParams } from "next/navigation";
import {
  GameDataAdmin,
  GetEntryBalanceCombinedResponse,
} from "./models/game-data.model";
import GiveawayService from "./services/GiveawayService"; // Import the GiveawayService
import EntryService from "./services/EntryService";

const DEFAULT_WIDTH = 1080;
const DEFAULT_HEIGHT = 1920;

const Game = () => {
  const [game, setGame] = useState<GameType>();
  const [data, setData] = useState<GameDataAdmin>();
  const [giveaway, setGiveaway] = useState<any>(null); // State for storing giveaway data
  const [urlParams, setUrlParams] = useState<any>(null);
  const [entries, setEntries] =
    useState<GetEntryBalanceCombinedResponse | null>(null);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [giveawayLoading, setGiveawayLoading] = useState(true);

  const searchParams = useSearchParams();
  // Extract query parameters
  const [missingValues, setMissingValues] = useState<string[]>([]);
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
        missingValues.push(key);
      }
    });
    setMissingValues(missingValues);
    setUrlParams(extractedParams);
  }, [searchParams]);

  // Fetch entry details and giveaway details
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
          setEntries(response);
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

  // Initialize Phaser game
  useEffect(() => {
    if (!game && data) {
      const initPhaser = async () => {
        const PhaserGame = new Phaser.Game({
          type: Phaser.CANVAS,
          antialias: true,
          backgroundColor: "#ffffff",
          scale: {
            parent: "phaser-game",
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
          },
          render: {
            pixelArt: false, // Important! Set to false for smooth graphics
            roundPixels: false, // Set to false for smoother graphics
            transparent: false,
            antialias: true, // Additional antialiasing setting
          },
          scene: [PreloadScene, new MainScene({ gameData: data })],
          physics: {
            default: "arcade",
            arcade: {
              debug: false,
              gravity: { x: 0, y: 980 },
              fps: 60,
            },
            //   matter: {
            //     debug: true,
            //     gravity: { y: 0.5 }
            // }
          },
        });
        setGame(PhaserGame);
      };
      initPhaser();
    }
  }, [game, data]);

  if (missingValues.length) {
    return <div>Missing params: {missingValues.join(", ")}</div>;
  }

  if (loadingEntries && giveawayLoading) {
    return <div>Loading...</div>;
  }

  return <div id="phaser-game" key={"phaser-game"}></div>;
};

export default Game;
