export default class Player extends Phaser.Physics.Arcade.Sprite {
  private cursorKeys: Phaser.Input.Keyboard.CursorKeys;
  private playerTexture: string;
  private playerNumber: number;
  private AWSD: any;
  private punch: Phaser.GameObjects.Rectangle;
  private punchX: number;

  constructor(params, playerNumber) {
    super(params.scene, params.x, params.x, params.texture, params.frame);

    this.scene = params.scene;
    this.playerNumber = playerNumber;
    this.playerTexture = params.texture;

    this.punch = this.scene.add.rectangle(
      this.x,
      this.y,
      40,
      40,
      0xff0000,
      0.3
    );

    // this.punch.enable(this.punch, Phaser.Physics.Arcade);
    this.punchX = 70;
    // physics
    this.scene.physics.world.enable(this);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.setSize(130, 300);

    //controls mapping
    this.AWSD = this.scene.input.keyboard.addKeys("W,S,A,D,Q,R");
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();

    this.scene.add.existing(this);

    this.init();
  }
  init(): void {
    const walkConfig = {
      key: `${this.playerTexture}_walk`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        start: 0,
        end: 3
      }),
      repeat: -1,
      frameRate: 15
    };

    const jumpConfig = {
      key: `${this.playerTexture}_jump`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        start: 5,
        end: 5
      }),
      frameRate: -1,
      repeat: -1
    };

    const punchConfig = {
      key: `${this.playerTexture}_punch`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [4, 3]
      }),
      yoyo: true,
      frameRate: -1,
      repeat: -1
    };

    const punchUpConfig = {
      key: `${this.playerTexture}_punch_up`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [6, 3]
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

    if (this.flipX) {
      this.punch.setPosition(this.x - this.punchX, this.y - 40);
    } else {
      this.punch.setPosition(this.x + this.punchX, this.y - 40);
    }
  }

  handleInputForPlayerOne(): void {
    if (this.cursorKeys.left.isDown) {
      this.setFlipX(true);
      this.anims.play(`${this.playerTexture}_walk`, true);
      this.setVelocityX(-500);
    } else if (this.cursorKeys.right.isDown) {
      this.setFlipX(false);
      this.anims.play(`${this.playerTexture}_walk`, true);
      this.setVelocityX(500);
    } else if (this.cursorKeys.up.isDown && this.body.touching.down) {
      this.setVelocityY(-930);
      this.anims.play(`${this.playerTexture}_jump`, true);
    } else {
      this.anims.stop();
      this.punch.setAlpha(0);
      this.setVelocityX(0);
    }
    if (this.cursorKeys.space.isDown) {
      this.anims.play(`${this.playerTexture}_punch`, true);
    } else if (this.cursorKeys.shift.isDown) {
      this.anims.play(`${this.playerTexture}_punch_up`, true);
      this.punch.setAlpha(1);
    }
  }

  handleInputForPlayerTwo(): void {
    if (this.AWSD.A.isDown) {
      this.setFlipX(true);
      this.anims.play(`${this.playerTexture}_walk`, true);
      this.setVelocityX(-500);
    } else if (this.AWSD.D.isDown) {
      this.setFlipX(false);
      this.anims.play(`${this.playerTexture}_walk`, true);
      this.setVelocityX(500);
    } else if (this.AWSD.W.isDown && this.body.touching.down) {
      this.setVelocityY(-930);
      this.anims.play(`${this.playerTexture}_jump`, true);
    } else {
      this.anims.stop();
      this.punch.setAlpha(0);
      this.setVelocityX(0);
    }
    if (this.AWSD.Q.isDown) {
      this.anims.play(`${this.playerTexture}_punch`, true);
    } else if (this.AWSD.R.isDown) {
      this.punch.setAlpha(1);
      this.anims.play(`${this.playerTexture}_punch_up`, true);
    }
  }

  collisionHandler() {
    return alert(1);
  }
}
