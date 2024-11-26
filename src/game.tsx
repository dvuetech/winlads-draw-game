import "phaser";
import Phaser, { Game as GameType } from "phaser";
import { useEffect, useState } from "react";
import PreloadScene from "./scenes/preloadScene";
import MainScene from "./scenes/MainScene";
import { GameDataAdmin } from "./models/game-data.model";

const DEFAULT_WIDTH = 1080;
const DEFAULT_HEIGHT = 1920;

const Game = () => {
  const [game, setGame] = useState<GameType>();

  useEffect(() => {
    if (!game) {
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
            clearBeforeRender: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            batchSize: 4096,
          },
          scene: [PreloadScene, MainScene],
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
  }, [game]);

  return <div id="phaser-game" key={"phaser-game"}></div>;
};
export default Game;
