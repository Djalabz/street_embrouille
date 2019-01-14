export default class Player extends Phaser.Physics.Arcade.Sprite {
  private cursorKeys: Phaser.Input.Keyboard.CursorKeys;
  private playerKey: string;
  private playerNumber: number;

  constructor(params, playerNumber) {
    super(params.scene, params.x, params.y, params.texture, 7);

    this.playerNumber = playerNumber;
    this.scene = params.scene;
    this.playerKey = params.texture;

    // physics
    this.scene.physics.world.enable(this);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.setSize(130, 300);

    this.cursorKeys = params.scene.input.keyboard.createCursorKeys();
    this.scene.add.existing(this);

    this.init();
  }
  init(): void {
    var walkConfig = {
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers(this.playerKey, {
        start: 7,
        end: 10
      }),
      repeat: -1,
      frameRate: 15
    };

    var jumpConfig = {
      key: "jump",
      frames: this.scene.anims.generateFrameNumbers(this.playerKey, {
        start: 12,
        end: 12
      }),
      frameRate: -1,
      repeat: -1
    };

    var punchConfig = {
      key: "punch",
      frames: this.scene.anims.generateFrameNumbers(this.playerKey, {
        frames: [11, 10]
      }),
      yoyo: true,
      frameRate: -1,
      repeat: -1
    };

    var punchUpConfig = {
      key: "punch_up",
      frames: this.scene.anims.generateFrameNumbers(this.playerKey, {
        frames: [13, 10]
      }),
      yoyo: true,
      frameRate: -1,
      repeat: -1
    };

    this.scene.anims.create(walkConfig);
    this.scene.anims.create(jumpConfig);
    this.scene.anims.create(punchConfig);
    this.scene.anims.create(punchUpConfig);
  }

  update(): void {
    if (this.playerNumber === 1) {
      this.handleInputForPlayerOne();
    } else {
      this.handleInputForPlayerTwo();
    }
  }

  handleInputForPlayerOne(): void {
    if (this.cursorKeys.left.isDown) {
      this.setFlipX(true);
      this.anims.play("walk", true);
      this.setVelocityX(-500);
    } else if (this.cursorKeys.right.isDown) {
      this.setFlipX(false);
      this.anims.play("walk", true);
      this.setVelocityX(500);
    } else if (this.cursorKeys.up.isDown && this.body.touching.down) {
      this.setVelocityY(-930);
      this.anims.play(`jump`, true);
    } else {
      this.anims.stop();
      this.setVelocityX(0);
    }
    if (this.cursorKeys.space.isDown) {
      this.anims.play(`punch`, true);
    } else if (this.cursorKeys.shift.isDown) {
      this.anims.play(`punch_up`, true);
    }
  }

  handleInputForPlayerTwo(): void {
    if (this.cursorKeys.left.isDown) {
      this.setFlipX(true);
      this.anims.play("walk", true);
      this.setVelocityX(-500);
    } else if (this.cursorKeys.right.isDown) {
      this.setFlipX(false);
      this.anims.play("walk", true);
      this.setVelocityX(500);
    } else if (this.cursorKeys.up.isDown && this.body.touching.down) {
      this.setVelocityY(-930);
      this.anims.play(`jump`, true);
    } else {
      this.anims.stop();
      this.setVelocityX(0);
    }
    if (this.cursorKeys.space.isDown) {
      this.anims.play(`punch`, true);
    } else if (this.cursorKeys.shift.isDown) {
      this.anims.play(`punch_up`, true);
    }
  }
}
