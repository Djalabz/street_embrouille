export class MainGame extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Sprite;
  private player2: Phaser.Physics.Arcade.Sprite;

  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private keyboard: any;
  private orientation: any;
  private flame: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: "MainGame"
    });
  }

  init(): void {
    this.orientation = null;
    this.player = null;
    this.player2 = null;
    this.flame = null;

    this.platforms = null;
    this.keyboard = null;
    this.orientation = null;
  }
  create() {
    this.add.image(-100, -30, "bg").setOrigin(0, 0);
    this.flame = this.add.sprite(-100, -30, "flame").setOrigin(0, 0);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.flame.alpha = Math.round(Math.random());
      },
      repeat: Infinity
    });

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(890, 1039, "ground");

    // The this.player and its settings
    this.player = this.physics.add.sprite(10, 850, "dude");

    //  this.Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // The this.player and its settings
    this.player2 = this.physics.add.sprite(1000, 850, "farikk");

    //  this.Player physics properties. Give the little guy a slight bounce.
    this.player2.setBounce(0.2);
    this.player2.setCollideWorldBounds(true);

    //  Collide the this.player and the stars with the this.platforms
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player2, this.platforms);
    this.physics.add.collider(this.player2, this.player);

    //  Our this.player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 3, end: 6 }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 7, end: 10 }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "jump_left",
      frames: this.anims.generateFrameNumbers("dude", { start: 1, end: 1 }),
      frameRate: -1,
      repeat: -1
    });

    this.anims.create({
      key: "jump_right",
      frames: this.anims.generateFrameNumbers("dude", { start: 12, end: 12 }),
      frameRate: -1,
      repeat: -1
    });

    this.anims.create({
      key: "punch_left",
      frames: this.anims.generateFrameNumbers("dude", { start: 2, end: 3 }),
      frameRate: -1,
      repeat: -1
    });

    this.anims.create({
      key: "punch_right",
      frames: this.anims.generateFrameNumbers("dude", { frames: [11, 10] }),
      yoyo: true,
      frameRate: -1,
      repeat: -1
    });

    this.anims.create({
      key: "punch_up_left",
      frames: this.anims.generateFrameNumbers("dude", { frames: [0, 3] }),
      frameRate: -1,
      repeat: -1
    });

    this.anims.create({
      key: "punch_up_right",
      frames: this.anims.generateFrameNumbers("dude", { frames: [13, 10] }),
      yoyo: true,
      frameRate: -1,
      repeat: -1
    });

    //  Input Events
    this.keyboard = this.input.keyboard.createCursorKeys();
  }

  onEvent() {}
  update() {
    if (this.keyboard.left.isDown) {
      this.orientation = "left";
      this.player.setVelocityX(-500);
      this.player.anims.play("left", true);
    } else if (this.keyboard.right.isDown) {
      this.orientation = "right";
      this.player.setVelocityX(500);
      this.player.anims.play("right", true);
    } else if (this.keyboard.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-930);
      this.player.anims.play(`jump_${this.orientation}`, true);
    } else {
      this.player.anims.stop();
      this.player.setVelocityX(0);
    }
    if (this.keyboard.space.isDown) {
      this.player.anims.play(`punch_${this.orientation}`, true);
    } else if (this.keyboard.shift.isDown) {
      this.player.anims.play(`punch_up_${this.orientation}`, true);
    }
  }
}
