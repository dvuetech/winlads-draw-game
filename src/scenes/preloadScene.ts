import { GameDataAdmin } from "@/models/game-data.model";

// PreloadScene handles the loading process and displays the loading bar.
export default class PreloadScene extends Phaser.Scene {
  loadingBar!: Phaser.GameObjects.Graphics;  
  progressBar!: Phaser.GameObjects.Graphics; 
  constructor() {
    super({ key: "PreloadScene" });
  }

  gameData?: GameDataAdmin;

  // Initialization of the scene, setting background color and creating the loading bar
  init() {
    this.cameras.main.setBackgroundColor(0x213f63);
    this.createLoadingBar();
  }


  // Preload method to load all assets required for the game
  preload() {
    // Update the progress bar as files are loaded
    this.load.on("progress", (value: number) => {
      // Clear any previous progress and set the progress bar color
      this.progressBar.clear();
      this.progressBar.fillStyle(0xe7a630, 1); 
      this.progressBar.fillRect(
        this.cameras.main.width / 4 - 2, 
        this.cameras.main.height / 2 - 18, 
        (this.cameras.main.width / 2) * value, 
        40
      );
    });

   this.load.on("fileprogress", (file: any) => {
      // console.log(file.src); 
    });

    // Once all files are loaded, destroy the loading and progress bars
    this.load.on("complete", () => {
      this.progressBar.destroy();
      this.loadingBar.destroy();
    });

    // Load images for the claw machine, prizes, and other assets
    this.load.image("machine", "assets/image/machine-01.png");
    this.load.image("bg-machine", "assets/image/bg-machine-01-01.png");
    this.load.image("congrats", "assets/image/congrats-01.png");
    this.load.image("get-gift", "assets/image/get-gift-01.png");
    this.load.image("buttonL", "assets/image/buttonL-01.png");
    this.load.image("buttonR", "assets/image/buttonR-01.png");
    this.load.image("grab", "assets/image/grab-01.png");
    this.load.image("claw", "assets/image/claw-01.png");
    this.load.image("claw-center", "assets/image/claw-center-01.png");
    this.load.image("btn-back", "assets/image/btn-back-01.png");
    this.load.image("btn-gift", "assets/image/btn-lihat-01.png");
    this.load.image("btn-music", "assets/image/btn-music-01.png");
    this.load.image("kembali", "assets/image/kembali-01.png");
    this.load.image("ok", "assets/image/ok-01.png");
    // this.load.image('lever', 'assets/image/lever.png')
    // this.load.image('round', 'assets/image/round.png')
    // this.load.image('bomb', 'assets/image/bomb-01.png')  
    this.load.image("gold", "assets/image/gold-01.png");
    this.load.image("silver", "assets/image/silver-01.png");
    this.load.image("bronze", "assets/image/bronze-01.png");
    this.load.image("pln", "assets/image/pln-01.png");
    this.load.image("pulsa", "assets/image/pulsa-01.png");
    this.load.image("paket-data", "assets/image/paket-data-01.png");
    this.load.image("vo-games", "assets/image/vo-games-01.png");

    // Additional prize images (with slight variations)
    this.load.image("gold2", "assets/image/gold-01.png");
    this.load.image("silver2", "assets/image/silver-01.png");
    this.load.image("bronze2", "assets/image/bronze-01.png");
    this.load.image("pln2", "assets/image/pln-01-01.png");
    this.load.image("pulsa2", "assets/image/pulsa-01-01.png");
    this.load.image("paket-data2", "assets/image/paket-data-01-01.png");
    this.load.image("vo-games2", "assets/image/vo-games-01-01.png");

    // More prize images (further variations)
    this.load.image("gold3", "assets/image/gold-01-01-01.png");
    this.load.image("silver3", "assets/image/silver-01-01-01.png");
    this.load.image("bronze3", "assets/image/bronze-01-01-01.png");
    this.load.image("pln3", "assets/image/pln-01-01-01.png");
    this.load.image("pulsa3", "assets/image/pulsa-01-01-01.png");
    this.load.image("paket-data3", "assets/image/paket-data-01-01-01.png");
    this.load.image("vo-games3", "assets/image/vo-games-01-01-01.png");
    // Load sound assets for the game
    this.load.audio("bs", "assets/audio/backsound.mp3");
    this.load.audio("congratsound", "assets/audio/congratsound.mp3");
    this.load.audio("movelr", "assets/audio/movelr2.mp3");
    this.load.audio("moveupdown", "assets/audio/moveup.mp3");
    this.load.audio("fall", "assets/audio/fall.mp3");
  }

  create() {
    this.scene.start("MainScene"); 
     /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }

  // Create the loading bar and the progress bar for showing the loading status
  private createLoadingBar() {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x257ca3, 1); 
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2, 
      this.cameras.main.height / 2 - 18, 
      this.cameras.main.width / 2 + 4, 
      40 
    );

    // Create the progress bar which will show the loading progress
    this.progressBar = this.add.graphics();
  }
}
