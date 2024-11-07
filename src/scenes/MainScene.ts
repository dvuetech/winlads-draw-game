import { Physics } from "phaser";

export default class MainScene extends Phaser.Scene {
  text1!: Phaser.GameObjects.Text;
  text2!: Phaser.GameObjects.Text;
  machine!: Phaser.GameObjects.Image;
  bgMachine!: Phaser.GameObjects.Image;
  congrats!: Phaser.GameObjects.Image;
  getGift!: Phaser.GameObjects.Image;
  buttonRight!: Phaser.GameObjects.Image;
  buttonGrab!: Phaser.GameObjects.Image;
  buttonLeft!: Phaser.GameObjects.Image;
  buttonMusic!: Phaser.GameObjects.Image;
  // buttonBack!: Phaser.GameObjects.Image
  buttonGift!: Phaser.GameObjects.Image;
  buttonOk!: Phaser.GameObjects.Image;
  buttonKembali!: Phaser.GameObjects.Image;
  claw!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  clawCenter!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  lever!: Phaser.GameObjects.Image;
  gifts!: Physics.Arcade.Group;
  displayGift!: any;
  congratsGift!: any;
  fps: any;
  speed: any;
  deltaTime: any;
  tween: any;
  popup!: any;
  isGrab!: any;
  isPlayMusic!: any;
  isGravity!: any;
  key!: Array<string>;
  description!: Array<string>;
  heightToIgnoreTheBall: any = 1;
  listGifts!: Array<string>;
  listGetGifts!: Phaser.GameObjects.Group;

  backsound!: any;
  congratsound!: any;
  movelr!: Phaser.Sound.BaseSound;
  moveUpDownSound!: Phaser.Sound.BaseSound;
  fall!: Phaser.Sound.BaseSound;

  keyL!: Phaser.Input.Keyboard.Key;
  keyR!: Phaser.Input.Keyboard.Key;
  keyD!: Phaser.Input.Keyboard.Key;
  OBJECT_COUNT = 40;
  SIZE = 0.2;

  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    const cam = this.cameras.main;
    this.cameras.main.setBackgroundColor(0xdcf3ff);
    // this.cameras.main.setBackgroundColor(0x213F63)
    this.speed = 10;
    this.tween = null;
    this.isGrab = false;
    this.isPlayMusic = true;
    this.isGravity = Phaser.Math.Between(0, 1);
    // this.heightToIgnoreTheBall = Phaser.Math.Between(210, 250);
    this.heightToIgnoreTheBall = 1;
    this.listGifts = [];

    this.text1 = this.add
      .text(26, 60, "", {
        color: "#000000",
        fontFamily: "Metropolis",
        fontSize: 12,
      })
      .setDepth(50);
    this.text2 = this.add
      .text(190, 360, "", {
        color: "#000000",
        fontFamily: "Metropolis",
        fontSize: 20,
      })
      .setOrigin(0.5)
      .setScale(0.1)
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
    this.backsound.play();
    this.movelr = this.sound.add("movelr", { loop: true });
    this.moveUpDownSound = this.sound.add("moveupdown", { loop: true });
    this.congratsound = this.sound.add("congratsound", { loop: false });
    this.fall = this.sound.add("fall", { loop: false, volume: 5 });

    this.congrats = this.add
      .image(cam.width / 2, cam.height / 2, "congrats")
      .setScale(0.1)
      .setVisible(false)
      .setDepth(100);
    this.getGift = this.add
      .image(cam.width / 2, cam.height / 2, "get-gift")
      .setScale(0.1)
      .setVisible(false)
      .setDepth(100);
    // this.getGift = this.add.image(cam.width / 2, cam.height / 2, 'gold3')
    //     .setScale(0.35)
    //     .setVisible(true)
    //     .setDepth(100)
    this.machine = this.add
      .image(cam.width / 2, cam.height / 2, "machine")
      .setScale(0.35);
    this.bgMachine = this.add
      .image(cam.width / 2, cam.height / 2, "bg-machine")
      .setScale(0.35)
      .setDepth(-100);
    this.buttonRight = this.add
      .image(305, 520, "buttonR")
      .setScale(0.35)
      .setOrigin(0.5, 1)
      .setInteractive();
    this.buttonGrab = this.add
      .image(190, 530, "grab")
      .setScale(0.35)
      .setOrigin(0.5, 1)
      .setInteractive();
    this.buttonLeft = this.add
      .image(70, 520, "buttonL")
      .setScale(0.35)
      .setOrigin(0.5, 1)
      .setInteractive();
    // this.buttonMusic = this.add.image(340, 36, 'btn-music')
    //     .setScale(0.35)
    //     .setInteractive()
    // this.buttonBack = this.add.image(35, 36, 'btn-back')
    //     .setScale(0.35)
    //     .setInteractive()
    this.buttonGift = this.add
      .image(67, 630, "btn-gift")
      .setScale(0.35)
      .setInteractive();
    this.displayGift = (key: string) => {
      this.add.image(67, 595, key).setScale(0.25);
    };
    this.congratsGift = this.add
      .image(190, 300, "key")
      .setScale(0.1)
      .setDepth(101)
      .setVisible(false);
    this.buttonOk = this.add
      .image(190, 470, "ok")
      .setScale(0.1)
      .setDepth(102)
      .setVisible(false)
      .setInteractive();
    this.buttonKembali = this.add
      .image(190, 470, "kembali")
      .setScale(0.1)
      .setDepth(102)
      .setVisible(false)
      .setInteractive();
    // this.buttonKembali = this.add.image(cam.width / 2, 270, 'gold3')
    //     .setScale(0.1)
    //     .setDepth(102)
    //     .setVisible(false)
    //     .setInteractive()
    this.claw = this.physics.add
      .image(cam.width / 2, 200, "claw")
      .setScale(this.SIZE)
      .setOrigin(0.5, 1)
      .setDepth(-50);
    this.claw.body.allowGravity = false;
    this.claw.body.setCircle(
      this.claw.width / 5,
      this.claw.width / 3.5,
      this.claw.height - 120
    );

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
      this.description = [
        "Panduka",
        "Naveen",
        "Ranmal",
        "Pasan",
        "Namesh",
        "Nimesh",
        "Malki",
      ];
      const rand = Phaser.Math.Between(0, 6);

      // Create a group if it doesn't exist
      if (this.gifts == null) {
        this.gifts = this.physics.add.group({
          bounceX: 0.2,
          bounceY: 0.2,
          collideWorldBounds: true,
          setXY: {
            x: Phaser.Math.Between(50, 300),
            y: Phaser.Math.Between(200, 300),
          },
          // setScale: { x: 0.01, y: 0.01 },
          customBoundsRectangle: new Phaser.Geom.Rectangle(29, 90, 323, 331), // Set boundaries
        });
        this.gifts.clear(true);
      }

      // Add a new round object to the group
      const newRound = this.gifts
        .create(
          Phaser.Math.Between(50, 300),
          Phaser.Math.Between(310, 330),
          this.key[rand]
        )
        .setScale(this.SIZE)
        .setVelocityY(this.speed);
      // Give name
      newRound.name = this.key[rand];

      // Enable circle collider for the round object
      newRound.body.setCircle(newRound.width / 2);

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

  listGiftsGroup() {
    if (this.listGetGifts == null) {
      this.listGetGifts = this.add.group({
        key: this.listGifts[this.listGifts.length],
        setScale: { x: 0.1 },
        setDepth: { z: 102 },
        visible: false,
      });
    }
    const lenght = this.listGifts.length;
    // const key = this.listGifts[lenght-1]
    this.listGifts.forEach((item: string, index: number) => {
      const newList = this.listGetGifts
        .create(this.cameras.main.width / 2, index * 40 + 260, item)
        .setScale(this.SIZE)
        .setVisible(true)
        .setDepth(110);
    });

    // console.log(key);
    // console.log(length);
  }

  setupInputListeners() {
    this.buttonGift.on("pointerdown", this.buttonGiftOn, this);
    this.buttonGift.on("pointerdown", this.listGiftsGroup, this);
    this.buttonKembali.on("pointerdown", this.buttonKembaliOn, this);
    this.buttonOk.on("pointerdown", this.buttonOkOn, this);
    // this.buttonMusic.on('pointerdown', this.buttonMusicOn, this);
    this.buttonRight.on("pointerdown", this.buttonRightOn, this);
    this.buttonRight.on("pointerup", this.buttonRightOff, this);
    this.buttonLeft.on("pointerdown", this.buttonLeftOn, this);
    this.buttonLeft.on("pointerup", this.buttonLeftOff, this);
    this.buttonGrab.on("pointerdown", this.buttonGrabOn, this);
    this.buttonGrab.on("pointerup", this.buttonGrabOff, this);
  }

  buttonGiftOn() {
    this.getGift.setVisible(true);
    this.buttonKembali.setVisible(true);
    // this.listGetGifts.setVisible(true)
    this.tween = this.tweens.add({
      targets: [this.getGift, this.buttonKembali, this.listGetGifts],
      scaleX: 0.35,
      scaleY: 0.35,
      duration: 1000,
      ease: "Elastic",
      repeat: 0,
    });
  }
  buttonKembaliOn() {
    this.buttonKembali.setVisible(false);
    this.getGift.setVisible(false);
    this.listGetGifts.setVisible(false);
    this.listGetGifts.scaleXY(0.1);
    this.buttonKembali.setScale(0.1);
    this.getGift.setScale(0.1);
  }
  buttonOkOn() {
    this.buttonOk.setVisible(false);
    this.congrats.setVisible(false);
    this.text2.setVisible(false);
    this.text2.setScale(0.1);
    this.buttonOk.setScale(0.1);
    this.congrats.setScale(0.1);
    this.congratsGift.setVisible(false);
  }
  buttonMusicOn() {
    if (this.isPlayMusic === true) {
      this.backsound.stop();
      this.isPlayMusic = false;
    } else {
      this.backsound.play();
      this.isPlayMusic = true;
    }
    console.log(this.isPlayMusic);
  }
  buttonRightOn() {
    if (
      this.claw.y == 200 &&
      this.claw.x < this.cameras.main.width - 25 &&
      this.claw.x > 25
    ) {
      this.claw.setVelocityX(this.speed * this.deltaTime);
      this.buttonRight.setScale(0.35, 0.3);
      this.movelr.play();
    }
  }
  buttonRightOff() {
    if (this.claw.y == 200) {
      this.claw.setVelocityX(0);
      this.buttonRight.setScale(0.35);
      this.movelr.stop();
    }
  }
  buttonLeftOn() {
    if (
      this.claw.y == 200 &&
      this.claw.x < this.cameras.main.width - 25 &&
      this.claw.x > 25
    ) {
      this.claw.setVelocityX(-this.speed * this.deltaTime);
      this.buttonLeft.setScale(0.35, 0.3);
      this.movelr.play();
    }
  }
  buttonLeftOff() {
    if (this.claw.y == 200) {
      this.claw.setVelocityX(0);
      this.buttonLeft.setScale(0.35);
      this.movelr.stop();
    }
  }
  buttonGrabOn() {
    if (this.claw.y == 200) {
      console.log(this.isGravity);
      this.buttonGrab.setScale(0.35, 0.3);
      this.claw.setVelocityY(this.speed * this.deltaTime);
      this.moveUpDownSound.play();
    }
  }
  buttonGrabOff() {
    if (this.claw.y > 200) {
      this.moveUpDownSound.play();
      this.buttonGrab.setScale(0.35);
    }
  }

  update(time: any, delta: number) {
    const giftArr: any = [];
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

    if (this.gifts) {
      // console.log(this.heightRand);
      // console.log(this.isGravity);
      this.gifts.getChildren().forEach((object) => {
        const imageObject = object as any;
        if (this.claw.y > 201 && imageObject) {
          this.physics.overlap(this.claw, object, () => {
            // Code to execute when claw and object collide
            giftArr.push(imageObject);
            // console.log(giftArr.map((i) => i.name))
            console.log({ isGravity: this.isGravity });
            if (
              false &&
              this.claw.y < this.heightToIgnoreTheBall && // A ball which is in heightToIgnoreTheBall height will be ignored.
              this.isGravity == 1
            ) {
              // Do not pick the ball
              this.fall.play();
              this.moveUpDownSound.stop();
              imageObject.body!.allowGravity = 1;
              // giftArr[0].setY(this.claw.y)
              giftArr[0].setY(this.claw.y + 20);
              giftArr[0].setX(this.claw.x);
            } else {
              // Pick the ball
              this.claw.setVelocityY(-this.speed * delta);
              imageObject.body!.allowGravity = 0;
              giftArr[0].setY(this.claw.y);
              giftArr[0].setX(this.claw.x);
            }
          });
        }

        if (imageObject.y > 100 && imageObject.y < 205) {
          console.log(`you get ${imageObject.name}!`);
          this.listGifts.push(`${imageObject.name}3`);
          this.heightToIgnoreTheBall = Phaser.Math.Between(205, 300);
          imageObject.destroy();
          object.destroy();
          this.claw.setVelocityY(0);
          this.claw.setY(200);
          this.displayGift(imageObject.name);
          this.congratsGift = this.add
            .image(this.cameras.main.width / 2 - 5, 285, `${imageObject.name}2`)
            .setScale(0.2)
            .setDepth(101)
            .setVisible(true);

          this.text2.setText(
            this.description[this.key.indexOf(imageObject.name)]
          );
          this.text2.setVisible(true);

          this.congrats.setVisible(true);
          this.buttonOk.setVisible(true);
          this.congratsound.play();
          this.tween = this.tweens.add({
            targets: [this.congrats, this.buttonOk, this.congratsGift],
            scaleX: 0.35,
            scaleY: 0.35,
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
        }
      });
    }

    if (this.claw.x <= 50) {
      this.claw.setX(50);
    }
    if (this.claw.x >= this.cameras.main.width - 50) {
      this.claw.setX(this.cameras.main.width - 50);
    }

    if (this.claw.y >= 420) {
      this.claw.setVelocityY(-this.speed * delta);
      this.moveUpDownSound.play();
    }

    if (this.claw.y < 200) {
      this.moveUpDownSound.stop();
      this.claw.setY(200);
      this.claw.setVelocity(0);
      this.isGravity = Phaser.Math.Between(0, 1);
      this.heightToIgnoreTheBall = Phaser.Math.Between(210, 250);
    }
  }
}
