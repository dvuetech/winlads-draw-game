/**
 * MainScene - A Phaser game scene that implements a claw machine game with prize selection
 * This scene manages a virtual claw machine where players can grab prizes and select winners
 * for a giveaway contest.
 */
import {
  EntryBalanceCombinedDto,
  GameDataAdmin,
} from "@/models/game-data.model";
import axios from "axios";
import { Physics } from "phaser";
import {
  chooseWinner,
  formatNameWithInitials,
  submitWinner,
} from "../context/GiveawayContext";

export default class MainScene extends Phaser.Scene {
  // UI Elements
  text1!: Phaser.GameObjects.Text;
  text2!: Phaser.GameObjects.Text;
  machine!: Phaser.GameObjects.Image;
  bgMachine!: Phaser.GameObjects.Image;
  congrats!: Phaser.GameObjects.Image;

  // Control buttons
  buttonRight!: Phaser.GameObjects.Image;
  buttonGrab!: Phaser.GameObjects.Image;
  buttonLeft!: Phaser.GameObjects.Image;
  buttonMusic!: Phaser.GameObjects.Image;
  // buttonBack!: Phaser.GameObjects.Image
  buttonGift!: Phaser.GameObjects.Image;
  giveawayTitle!: Phaser.GameObjects.Text;
  buttonOk!: Phaser.GameObjects.Image;
  buttonDoneWinner!: Phaser.GameObjects.Image;

  // Game objects
  claw!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  clawCenter!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  lever!: Phaser.GameObjects.Image;
  gifts!: Physics.Arcade.Group;

  // UI elements for displaying prizes
  displayGift!: any;
  congratsGift!: any;

  // Game state variables
  fps: any;
  speed: any;
  deltaTime: any;
  tween: any;
  popup!: any;
  isGrab!: any;
  isPlayMusic!: any;
  isGravity!: any;
  key!: Array<string>;
  heightToIgnoreTheBall: any = 1;

  // Prize display elements
  listGetGifts!: Phaser.GameObjects.Group;
  getGift!: Phaser.GameObjects.Image;

  // Sound effects
  backsound!: any;
  congratsound!: any;
  movelr!: Phaser.Sound.BaseSound;
  moveUpDownSound!: Phaser.Sound.BaseSound;
  fall!: Phaser.Sound.BaseSound;

  // Keyboard controls
  keyL!: Phaser.Input.Keyboard.Key;
  keyR!: Phaser.Input.Keyboard.Key;
  keyD!: Phaser.Input.Keyboard.Key;

  // Game configuration constants
  OBJECT_COUNT = 60;
  SIZE = 0.6;
  CLAW_TOP_Y = 600;

  // Game boundaries
  readonly BOUNDARY_LEFT = 100;
  readonly BOUNDARY_TOP = 200;
  readonly BOUNDARY_WIDTH = 920;
  readonly BOUNDARY_HEIGHT = 1050;

  constructor(config: { gameData?: GameDataAdmin }) {
    super({
      key: "MainScene",
      physics: {
        arcade: {
          debug: false, // This will show physics bodies
          debugShowBody: true,
          debugShowStaticBody: true,
          debugShowVelocity: true,
          debugVelocityColor: 0xff0000,
          debugBodyColor: 0x0000ff,
          debugStaticBodyColor: 0xffffff,
        },
      },
    });
    console.log(config);
    this.gameData = config?.gameData;
    this.giveawayEntries = this.gameData?.entries ?? [];
  }

  gameData?: GameDataAdmin;
  giveawayEntries: EntryBalanceCombinedDto[] = [];

  create() {
    console.log("gameData", this.gameData);
    const cam = this.cameras.main;
    this.cameras.main.setBackgroundColor(0xdcf3ff);
    // this.cameras.main.setBackgroundColor(0x213F63)
    this.speed = 24;
    this.tween = null;
    this.isGrab = false;
    this.isPlayMusic = false;
    this.isGravity = Phaser.Math.Between(0, 1);
    // this.heightToIgnoreTheBall = Phaser.Math.Between(210, 250);
    this.heightToIgnoreTheBall = 3;

    this.text1 = this.add
      .text(50, 120, "", {
        color: "#000000",
        fontFamily: "Metropolis",
        fontSize: 12,
      })
      .setDepth(50);
    this.text2 = this.add
      .text(540, 1000 - 300, "", {
        color: "#000000",
        fontFamily: "Metropolis",
        fontSize: 48,
      })
      .setOrigin(0.5)
      .setScale(1.0)
      .setVisible(false)
      .setDepth(105);

    this.keyL = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.keyR = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.keyD = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );

    this.backsound = this.sound.add("bs", { loop: true, volume: 0.5 });
    // this.backsound.play();
    this.movelr = this.sound.add("movelr", { loop: true });
    this.moveUpDownSound = this.sound.add("moveupdown", { loop: true });
    this.congratsound = this.sound.add("congratsound", { loop: false });
    this.fall = this.sound.add("fall", { loop: false, volume: 5 });

    this.congrats = this.add
      .image(cam.width / 2, cam.height / 2, "congrats")
      .setScale(1.5)
      .setVisible(false)
      .setDepth(100);
    this.getGift = this.add
      .image(cam.width / 2, cam.height / 2, "get-gift")
      .setScale(1.0)
      .setVisible(false)
      .setDepth(100);
    // this.getGift = this.add.image(cam.width / 2, cam.height / 2, 'gold3')
    //     .setScale(0.35)
    //     .setVisible(true)
    //     .setDepth(100)
    this.machine = this.add
      .image(cam.width / 2, cam.height / 2, "machine")
      .setScale(1.0);
    this.bgMachine = this.add
      .image(cam.width / 2, cam.height / 2, "bg-machine")
      .setScale(1)
      .setDepth(-100);
    this.buttonRight = this.add
      .image(880, 1500, "buttonR")
      .setScale(1.0)
      .setVisible(false)
      .setOrigin(0.5, 1)
      .setInteractive();
    this.buttonGrab = this.add
      .image(540, 1530, "grab")
      .setScale(1)
      .setOrigin(0.5, 1)
      .setInteractive();
    this.buttonLeft = this.add
      .image(200, 1500, "buttonL")
      .setScale(1)
      .setVisible(false)
      .setOrigin(0.5, 1)
      .setInteractive();
    // this.buttonMusic = this.add.image(340, 36, 'btn-music')
    //     .setScale(0.35)
    //     .setInteractive()
    // this.buttonBack = this.add.image(35, 36, 'btn-back')
    //     .setScale(0.35)
    //     .setInteractive()
    this.buttonGift = this.add
      .image(150, 1800, "btn-gift")
      .setScale(1.0)
      .setVisible(false)
      .setInteractive();
    this.giveawayTitle = this.add
      .text(500, 1650, this.gameData?.giveaway?.title ?? "", {
        fontFamily: "Arial Black, sans-serif", // More impactful font
        fontSize: 50,
        fontStyle: "italic",
        color: "#59e1ff", // White text
        stroke: "#59e1ff", // Black outline
        strokeThickness: 8, // Thick outline for better visibility
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "#000000",
          blur: 5,
          fill: true,
        },
        backgroundColor: "#000000",
        padding: {
          x: 40,
          y: 25,
        },
        align: "center",
        wordWrap: {
          width: 400,
          useAdvancedWrap: true,
        },
      })
      .setShadow(2, 2, "#333333", 2, true, true);

    // Optional: Add a shine/glow effect
    this.tweens.add({
      targets: this.giveawayTitle,
      alpha: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 1000,
    });
    this.displayGift = (key: string) => {
      this.add.image(140, 1675, key).setScale(1);
    };
    this.congratsGift = this.add
      .image(540, 860, "key")
      .setScale(1.0)
      .setDepth(101)
      .setVisible(false);
    this.buttonOk = this.add
      .image(550, 1370, "ok")
      .setScale(1.0)
      .setDepth(102)
      .setVisible(false)
      .setInteractive();
    this.buttonDoneWinner = this.add
      .image(550, 1400, "kembali")
      .setScale(1.0)
      .setDepth(102)
      .setVisible(false)
      .setInteractive();
    // this.buttonDoneWinner = this.add.image(cam.width / 2, 270, 'gold3')
    //     .setScale(0.1)
    //     .setDepth(102)
    //     .setVisible(false)
    //     .setInteractive()
    this.claw = this.physics.add
      .image(cam.width / 2, this.CLAW_TOP_Y, "claw")
      .setScale(this.SIZE)
      .setOrigin(0.5, 1.1)
      .setDepth(-50);
    this.claw.body.allowGravity = false;
    const r = this.claw.width / 10;
    this.claw.body.setCircle(r, this.claw.width / 2 - r, this.claw.height - 70);
    // this.physics.world.createDebugGraphic();

    const randomRound = () => {
      this.key = [
        "silver",
        "gold",
        "bronze",
        "pln",
        "pulsa",
        "paket-data",
        "vo-games",
      ];
      const rand = Phaser.Math.Between(0, 6);

      // Create a group if it doesn't exist
      if (this.gifts == null) {
        this.gifts = this.physics.add.group({
          bounceX: 0.2,
          bounceY: 0.2,
          collideWorldBounds: true,
          setXY: {
            x: Phaser.Math.Between(150, 930),
            y: Phaser.Math.Between(600, 800),
          },
          // setScale: { x: 0.01, y: 0.01 },
          customBoundsRectangle: new Phaser.Geom.Rectangle(
            this.BOUNDARY_LEFT, // Left boundary
            this.BOUNDARY_TOP, // Top boundary
            this.BOUNDARY_WIDTH, // Width of play area
            this.BOUNDARY_HEIGHT // Height of play area, // Set boundaries
          ),
        });
        this.gifts.clear(true);
      }

      // Add a new round object to the group
      const newRound = this.gifts
        .create(
          Phaser.Math.Between(150, cam.width - 150),
          Phaser.Math.Between(1000, 1100),
          this.key[rand]
          // this.key[Phaser.Math.Between(0, 6)]
        )
        .setScale(this.SIZE)
        .setVelocityY(this.speed);
      // Give name
      newRound.name = this.key[rand];

      // Enable circle collider for the round object
      newRound.body.setCircle(newRound.width / 2);
      newRound.body.setAllowGravity(true);
      // Enable collision between objects in the group
      this.physics.add.collider(this.gifts, this.gifts);
    };

    this.time.addEvent({
      delay: 50,
      callback: randomRound,
      callbackScope: this,
      repeat: this.OBJECT_COUNT, // Adding the number of objects to be created
    });

    this.setupInputListeners();
  }

  //Returns list of winners' names
  get listGifts() {
    return this.winners?.map((winner) => winner.name) ?? [];
  }

  //Creates and displays the list of winners
  listGiftsGroup() {
    // Clear existing group if it exists
    if (this.listGetGifts) {
      this.listGetGifts.clear(true);
    }

    // Initialize group if null
    if (this.listGetGifts == null) {
      this.listGetGifts = this.add.group();
    }

    // Create text objects for each winner
    this.listGifts.forEach((name: string, index: number) => {
      const winnerNameText = this.add
        .text(
          this.cameras.main.width / 2,
          index * 50 + 700,
          formatNameWithInitials(name),
          {
            fontFamily: "Arial Black",
            fontSize: "36px",
            color: "#008479",
            align: "left",
          }
        )
        .setOrigin(0.5) // Center align the text
        .setDepth(110);

      this.listGetGifts.add(winnerNameText);
    });
    // console.log(key);
    // console.log(length);
  }

  setupInputListeners() {
    this.buttonGift.on("pointerdown", this.buttonGiftOn, this);
    this.buttonGift.on("pointerdown", this.listGiftsGroup, this);
    this.buttonDoneWinner.on("pointerdown", this.buttonDoneWinnerOn, this);
    this.buttonOk.on("pointerdown", this.buttonOkOn, this);
    // this.buttonMusic.on('pointerdown', this.buttonMusicOn, this);
    this.buttonRight.on("pointerdown", this.buttonRightOn, this);
    this.buttonRight.on("pointerup", this.buttonRightOff, this);
    this.buttonLeft.on("pointerdown", this.buttonLeftOn, this);
    this.buttonLeft.on("pointerup", this.buttonLeftOff, this);
    this.buttonGrab.on("pointerdown", this.buttonGrabOn, this);
    this.buttonGrab.on("pointerup", this.buttonGrabOff, this);
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "u") {
        const winners = this.winners;
        const winnersString = winners
          .filter((w) => w?.userId)
          .map((w) => `* ${w.name} (${w.email}) (${w.mobileNumber})`)
          .join("\n");
        if (winnersString?.length) alert(`Winners List:\n\n${winnersString}`);
      }
    });
  }

  buttonGiftOn() {
    this.getGift.setVisible(true);
    this.buttonDoneWinner.setVisible(true);
    // this.listGetGifts.setVisible(true)
    this.tween = this.tweens.add({
      targets: [this.getGift, this.buttonDoneWinner, this.listGetGifts],
      scaleX: 1.0,
      scaleY: 1.0,
      duration: 1000,
      ease: "Elastic",
      repeat: 0,
    });
  }
  buttonDoneWinnerOn() {
    if (this.winners.length > 0) {
      this.buttonDoneWinner.setVisible(false);
      this.getGift.setVisible(false);
      this.listGetGifts.setVisible(false);
      this.listGetGifts.scaleXY(1.0);
      this.buttonDoneWinner.setScale(1.0);
      this.getGift.setScale(1.0);
      // this.submitWinner();
    }
  }

  buttonOkOn() {
    this.buttonOk.setVisible(false);
    this.congrats.setVisible(false);
    this.congratsGift.setVisible(false);
    this.text2.setVisible(false);
    this.text2.setScale(1.0);
    this.buttonOk.setScale(1.0);
    this.congrats.setScale(1.0);
  }

  async submitWinner(winner: EntryBalanceCombinedDto) {
    return submitWinner(this.gameData!, winner);
  }

  buttonMusicOn() {
    if (this.isPlayMusic === true) {
      this.backsound.stop();
      this.isPlayMusic = false;
    } else {
      this.backsound.play();
      this.isPlayMusic = true;
    }
  }
  buttonRightOn() {
    if (this.claw.y == this.CLAW_TOP_Y) {
      this.claw.setVelocityX(this.speed * this.deltaTime);
      this.buttonRight.setScale(1.0);
      // this.movelr.play();
    }
  }
  buttonRightOff() {
    if (this.claw.y == this.CLAW_TOP_Y) {
      this.claw.setVelocityX(0);
      this.buttonRight.setScale(1.0);
      this.movelr.stop();
    }
  }
  buttonLeftOn() {
    if (this.claw.y == this.CLAW_TOP_Y) {
      this.claw.setVelocityX(-this.speed * this.deltaTime);
      this.buttonLeft.setScale(1.0);
      // this.movelr.play();
    }
  }
  buttonLeftOff() {
    if (this.claw.y == this.CLAW_TOP_Y) {
      this.claw.setVelocityX(0);
      this.buttonLeft.setScale(1.0);
      this.movelr.stop();
    }
  }
  private moveDirection: "left" | "right" | "middle" = "right";
  private isAutoMoving: boolean = false; // Add this flag

  buttonGrabOn() {
    if (this.claw.y == this.CLAW_TOP_Y && !this.isAutoMoving) {
      this.isAutoMoving = true;
      this.buttonGrab.setScale(1, 0.95);
      // this.moveUpDownSound.play();
      this.startAutoMovement();
      const { winner, giveawayEntries } = chooseWinner(
        this.giveawayEntries ?? [],
        this.winners
      );
      this.giveawayEntries = giveawayEntries;
      this.winnerId = new Promise((resolve) => {
        resolve(winner);
      });
    }
  }

  winnerId?: Promise<string>;
  winners: EntryBalanceCombinedDto[] = [];

  clawDestinationY: number = this.BOUNDARY_HEIGHT + this.BOUNDARY_TOP;
  startAutoMovement() {
    let xMovement: number;
    const middleX = this.cameras.main.width / 2;

    // Determine movement based on direction
    switch (this.moveDirection) {
      case "right":
        xMovement = this.cameras.main.width - 200;
        break;
      case "left":
        xMovement = 200;
        break;
      case "middle":
        xMovement = middleX;
        break;
    }

    // First move horizontally
    this.tweens.add({
      targets: this.claw,
      x: xMovement, // FIRST move horizontally (x)
      duration: 2000,
      ease: "Linear",
      onStart: () => {
        if (this.claw.x < xMovement) {
          this.buttonRightOn();
        } else {
          this.buttonLeftOn();
        }
        // this.movelr.play();
      },
      onComplete: () => {
        this.buttonRightOff();
        this.buttonLeftOff();
        this.movelr.stop();

        // THEN move vertically after horizontal movement is complete
        this.time.delayedCall(500, () => {
          this.clawDestinationY = Phaser.Math.Between(
            this.BOUNDARY_TOP + this.BOUNDARY_HEIGHT - 50,
            this.BOUNDARY_TOP + this.BOUNDARY_HEIGHT + 200
          );
          this.tweens.add({
            targets: this.claw,
            y: this.clawDestinationY, // Move down
            duration: 4000,
            ease: "Linear",
            onStart: () => {
              // this.moveUpDownSound.play();
            },
            onComplete: () => {
              // Move back up
              this.tweens.add({
                targets: this.claw,
                y: this.CLAW_TOP_Y, // Move back to starting position
                duration: 4000,
                ease: "Linear",
                onComplete: () => {
                  this.moveUpDownSound.stop();
                  this.buttonGrab.setScale(1.0);
                  this.isAutoMoving = false;

                  // Update direction for next time
                  switch (this.moveDirection) {
                    case "right":
                      this.moveDirection = "middle";
                      break;
                    case "middle":
                      this.moveDirection = "left";
                      break;
                    case "left":
                      this.moveDirection = "right";
                      break;
                  }
                },
              });
            },
          });
        });
      },
    });
  }

  buttonGrabOff() {
    if (this.claw.y > this.CLAW_TOP_Y) {
      // this.moveUpDownSound.play();
      this.buttonGrab.setScale(1.0);
      // this.moveUpDownSound.play();
      // this.startAutoMovement();
      // this.chooseWinner();
    }
  }

  private currentGift: any = null; // Add this property to track current gift
  alreadyPickedObject: any = null;
  update(time: any, delta: number) {
    const pointer = this.input.activePointer;
    this.fps = this.game.loop.actualFps;
    this.deltaTime = delta;

    //DEBUG
    // this.text1.setText([
    //     `x: ${pointer.worldX}`,
    //     `y: ${pointer.worldY}`,
    //     `isDown: ${pointer.isDown}`,
    //     `FPS:${this.fps}`,
    //     `Delta time:${delta}`
    // ]);

    if (this.alreadyPickedObject) {
      this.alreadyPickedObject.body!.allowGravity = 0;
      this.alreadyPickedObject.setY(
        this.claw.body.y + this.claw.body.radius / 2
      );
      this.alreadyPickedObject.setX(
        this.claw.body.x + this.claw.body.radius / 2
      );
    }
    if (this.gifts) {
      this.gifts.getChildren().forEach((object) => {
        const imageObject = object as any;
        this.currentGift = imageObject;
        if (this.claw.y > this.CLAW_TOP_Y && imageObject) {
          this.physics.overlap(this.claw, object, () => {
            if (this.alreadyPickedObject === object) return;
            if (this.alreadyPickedObject) {
              this.alreadyPickedObject.body!.allowGravity = 1;
            }
            this.alreadyPickedObject = object;
          });

          if (this.alreadyPickedObject) {
            this.physics.overlap(this.alreadyPickedObject, object, () => {
              this.alreadyPickedObject.body!.allowGravity = 1;
              this.alreadyPickedObject = object;
            });
          }
        }
        // if (this.claw.y > 800 && imageObject) {
        //   this.physics.overlap(this.claw, object, () => {
        //     giftArr.push(imageObject);
        //     imageObject.body!.allowGravity = 0;
        //     giftArr[0].setY(this.claw.y + 50);  // Increased offset for new scale
        //     giftArr[0].setX(this.claw.x);
        //   });
        // }

        // Check if gift is no longer overlapping
        if (!this.physics.overlap(this.claw, this.currentGift)) {
          this.currentGift.body!.allowGravity = 1;
        }
      });
    }
    const imageObject = this.alreadyPickedObject;
    if (imageObject && this.claw.y === this.CLAW_TOP_Y) {
      console.log(`you get ${imageObject.name}!`, imageObject.y);
      this.listGifts.push(`${imageObject.name}3`);
      this.alreadyPickedObject = null;
      imageObject.destroy();
      imageObject.destroy();
      this.claw.setVelocityY(0);
      this.claw.setY(this.CLAW_TOP_Y);
      this.displayGift(imageObject.name);
      // this.congratsGift = this.add
      //   .image(
      //     this.cameras.main.width / 2 - 5,
      //     this.CLAW_TOP_Y,
      //     `${imageObject.name}2`
      //   )
      //   .setScale(1.0)
      //   .setDepth(101)
      //   .setVisible(true);
      this.winnerId?.then((winner) => {
        console.log("Winner is ", winner);
        const entry = this.giveawayEntries.find((e) => e.userId === winner);
        this.winners.push(entry!);
        this.submitWinner(entry!);
        this.buttonGift.setVisible(true);
        this.text2.setText(formatNameWithInitials(entry?.name!));
        this.text2.setVisible(true);

        this.congrats.setVisible(true);
        this.buttonOk.setVisible(true);
        this.congratsound.play();
        this.tween = this.tweens.add({
          targets: [this.congrats, this.buttonOk, this.congratsGift],
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 1000,
          ease: "Elastic",
          repeat: 0,
        });
        this.tween = this.tweens.add({
          targets: [this.text2],
          scaleX: 1,
          scaleY: 1,
          duration: 1000,
          ease: "Elastic",
          repeat: 0,
        });
      });
    }
    if (this.claw.x <= 150) {
      this.claw.setX(150);
      // this.claw.setVelocityX(0); // Stop movement at boundary
      // this.movelr.stop();
    }
    if (this.claw.x >= 930) {
      this.claw.setX(930);
      // this.claw.setVelocityX(0); // Stop movement at boundary
      // this.movelr.stop();
    }

    if (this.claw.y >= this.clawDestinationY) {
      this.claw.setVelocityY(-this.speed * delta);
      // this.moveUpDownSound.play();
    }

    if (this.claw.y < this.CLAW_TOP_Y) {
      this.moveUpDownSound.stop();
      this.claw.setY(this.CLAW_TOP_Y);
      this.claw.setVelocity(0);
      this.isGravity = Phaser.Math.Between(0, 1);
      this.heightToIgnoreTheBall = Phaser.Math.Between(810, 900);
    }
  }
}
