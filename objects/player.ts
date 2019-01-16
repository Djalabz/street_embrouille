export default class Player extends Phaser.Physics.Arcade.Sprite {
  private player1Controls: Phaser.Input.Keyboard.CursorKeys;
  private playerTexture: string;
  private playerNumber: number;
  private life: number;
  private player2Controls: any;
  private lifeBar: Phaser.GameObjects.Rectangle;
  private lifeBarBackground: Phaser.GameObjects.Rectangle;
  private isCrouch: boolean;

  private punch: Phaser.GameObjects.Rectangle;
  private punchX: number;

  constructor(params, playerNumber) {
    super(params.scene, params.x, params.x, params.texture, params.frame);

    this.life = 2000;

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

    this.lifeBarBackground = this.scene.add.rectangle(
      this.playerNumber === 1 ? 300 : 1380,
      20,
      500,
      30,
      0xff0000,
      1
    );

    this.lifeBar = this.scene.add.rectangle(
      this.playerNumber === 1 ? 300 : 1380,
      20,
      this.life / 4,
      30,
      0x0ebc79,
      1
    );

    //playerState
    this.isCrouch = false;
    this.flipX = this.playerNumber === 1 ? true : false;
    //hitboxes
    this.punchX = 70;

    // physics
    this.scene.physics.world.enable(this);
    this.setCollideWorldBounds(true);
    this.setSize(130, 300);

    //controls mapping
    this.player1Controls = this.scene.input.keyboard.createCursorKeys();
    this.player2Controls = this.scene.input.keyboard.addKeys("W,S,A,D,Q,R");

    this.scene.add.existing(this);

    this.configAnimations();
  }
  configAnimations(): void {
    const idleConfig = {
      key: `${this.playerTexture}_idle`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        start: 0,
        end: 1
      }),
      repeat: 1,
      frameRate: 1
    };

    const walkConfig = {
      key: `${this.playerTexture}_walk`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        start: 0,
        end: 3
      }),
      repeat: 1,
      frameRate: 27
    };

    const crouchConfig = {
      key: `${this.playerTexture}_crouch`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [7]
      }),
      repeat: 0,
      frameRate: 20
    };

    const jumpConfig = {
      key: `${this.playerTexture}_jump`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [5]
      }),
      frameRate: 20,
      repeat: 1
    };

    const punchConfig = {
      key: `${this.playerTexture}_punch`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [4, 3]
      }),
      frameRate: 15,
      repeat: 0
    };

    const punchUpConfig = {
      key: `${this.playerTexture}_punch_up`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [6, 3]
      }),
      frameRate: 13,
      repeat: 0
    };
    this.scene.anims.create(idleConfig);
    this.scene.anims.create(walkConfig);
    this.scene.anims.create(crouchConfig);
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

    this.lifeBar.setDisplaySize(this.life / 4, 30);
  }

  handleInputForPlayerOne(): void {
    if (!this.anims.isPlaying) {
      this.anims.play(`${this.playerTexture}_idle`, true);
      this.isCrouch = false;
    }

    this.punch.setAlpha(0);
    // turn & walk
    if (this.player1Controls.left.isDown) {
      this.setFlipX(true);

      if (!this.player1Controls.down.isDown) {
        this.anims.play(`${this.playerTexture}_walk`, true);
        this.setVelocityX(-500);
      }
    } else if (this.player1Controls.right.isDown) {
      this.setFlipX(false);

      if (!this.player1Controls.down.isDown) {
        this.anims.play(`${this.playerTexture}_walk`, true);
        this.setVelocityX(500);
      }
    } else {
      this.setVelocityX(0);
    }

    // jump
    if (this.player1Controls.up.isDown && this.body.touching.down) {
      this.setVelocityY(-2000);
      this.anims.play(`${this.playerTexture}_jump`, true);
    } else if (!this.body.touching.down) {
      this.anims.play(`${this.playerTexture}_jump`, true);
    }

    //punch
    if (
      Phaser.Input.Keyboard.JustDown(this.player1Controls.space) &&
      this.body.touching.down &&
      !this.isCrouch
    ) {
      this.anims.play(`${this.playerTexture}_punch`, true);
      this.punch.setAlpha(1);
      this.checkCollision("player2");
      //punch Up
    } else if (
      Phaser.Input.Keyboard.JustDown(this.player1Controls.shift) &&
      this.body.touching.down &&
      !this.isCrouch
    ) {
      this.anims.play(`${this.playerTexture}_punch_up`, true);
      this.punch.setAlpha(1);
      this.checkCollision("player2");
    }

    //crouch
    if (this.player1Controls.down.isDown) {
      this.anims.play(`${this.playerTexture}_crouch`, true);
      this.setVelocityX(0);
      this.isCrouch = true;
    }
  }

  handleInputForPlayerTwo(): void {
    if (this.player2Controls.A.isDown && this.body.touching.down) {
      this.setFlipX(true);

      this.anims.play(`${this.playerTexture}_walk`, true);

      this.setVelocityX(-500);
    } else if (this.player2Controls.D.isDown && this.body.touching.down) {
      this.setFlipX(false);

      this.anims.play(`${this.playerTexture}_walk`, true);

      this.setVelocityX(500);
    } else if (this.player2Controls.W.isDown && this.body.touching.down) {
      this.anims.play(`${this.playerTexture}_jump`, true);

      this.setVelocityY(-1330);
    } else if (this.body.touching.down) {
      this.punch.setAlpha(0);

      this.anims.play(`${this.playerTexture}_walk`, false);

      this.anims.stop();

      this.setVelocityX(0);
    } else if (!this.body.touching.down) {
      this.anims.play(`${this.playerTexture}_jump`, true);
    }
    if (Phaser.Input.Keyboard.JustDown(this.player2Controls.Q)) {
      this.punch.setAlpha(1);

      this.anims.play(`${this.playerTexture}_punch`, true);

      this.checkCollision("player1");
    } else if (Phaser.Input.Keyboard.JustDown(this.player2Controls.R)) {
      this.punch.setAlpha(1);

      this.anims.play(`${this.playerTexture}_punch_up`, true);

      this.checkCollision("player1");
    } else if (this.player2Controls.S.isDown) {
      this.anims.play(`${this.playerTexture}_crouch`, true);
    }
  }

  checkCollision(player: string): void {
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.scene[player].getBounds(),
        this.punch.getBounds()
      )
    ) {
      this.collisionHandler(player);
    }
  }

  collisionHandler(player: string) {
    this.scene[player]["life"] = this.scene[player]["life"] - 10;
    console.log(this.scene[player]["life"]);
  }
}
