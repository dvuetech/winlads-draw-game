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
import GiveawayService from "./services/GiveawayService"; // Import the GiveawayService for fetching giveaway data
import EntryService from "./services/EntryService"; // Import the EntryService for fetching entries
import { useGiveawayContext } from "./context/GiveawayContext";

const DEFAULT_WIDTH = 1080;
const DEFAULT_HEIGHT = 1920;

const Game = () => {
  // State hooks for managing the game instance and data
  const [game, setGame] = useState<GameType>();
  const { data, missingValues, loadingEntries, giveawayLoading, isUnauthorized } =
    useGiveawayContext();

  // Initialize the Phaser game instance once the data is available
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

  if (isUnauthorized) {
    return <div>Unauthorized: Please launch the game again.</div>;
  }

  // Render a message if URL parameters are missing
  if (missingValues.length) {
    return <div>Missing params: {missingValues.join(", ")}</div>;
  } else if (loadingEntries && giveawayLoading) {
    // Render a loading state if giveaway or entries data are still loading
    return <div>Loading...</div>;
  } else {
    // Render the Phaser game once everything is ready
    return <div id="phaser-game" key={"phaser-game"}></div>;
  }
};

export default Game;
