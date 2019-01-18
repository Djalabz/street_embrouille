import { PLAYER_CONSTANTS } from "./constants/constants";
export default class Player extends Phaser.Physics.Arcade.Sprite {
  private player1Controls: Phaser.Input.Keyboard.CursorKeys;
  private playerTexture: string;
  private playerNumber: number;
  private life: number;
  private player2Controls: any;
  private lifeBar: Phaser.GameObjects.Rectangle;
  private lifeBarBackground: Phaser.GameObjects.Rectangle;
  private isCrouch: boolean;

  private hitBoxsPos: any;
  private punchHitBox: Phaser.GameObjects.Rectangle;
  private punchUpHitBox: Phaser.GameObjects.Rectangle;
  private punchUpX: number;
  private punchX: number;

  constructor(params, playerNumber) {
    super(params.scene, params.x, params.x, params.texture, params.frame);

    this.scene = params.scene;
    this.playerNumber = playerNumber;
    this.playerTexture = params.texture;
    //playerState
    this.life = 2000;
    this.isCrouch = false;
    this.flipX = this.playerNumber === 1 ? true : false;

    this.setDisplaySize(
      PLAYER_CONSTANTS[this.playerTexture].width,
      PLAYER_CONSTANTS[this.playerTexture].height
    );

    //hitboxes positions
    this.punchUpX = 70;
    this.hitBoxsPos = {
      punch: { x: 60, y: 10 },
      punchUp: { x: 90, y: 50 }
    };
    this.generateHitBoxes();

    // physics

    this.scene.physics.world.enable(this);
    this.body.setSize(110, 300);
    this.body.setOffset(
      PLAYER_CONSTANTS[this.playerTexture].offSetX,
      PLAYER_CONSTANTS[this.playerTexture].offSetY
    );
    this.setCollideWorldBounds(true);
    this.body.setMass(123);
    this.body.checkCollision.up = false;

    //controls mapping
    this.player1Controls = this.scene.input.keyboard.createCursorKeys();
    this.player2Controls = this.scene.input.keyboard.addKeys("W,S,A,D,Q,R");

    this.scene.add.existing(this);

    this.configAnimations();
  }
  configAnimations(): void {
    this.scene.anims.create({
      key: `${this.playerTexture}_idle`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        start: 0,
        end: 2
      }),
      yoyo: true,
      repeat: 1,
      frameRate: 7
    });

    this.scene.anims.create({
      key: `${this.playerTexture}_walk`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        start: 3,
        end: 5
      }),
      repeat: 1,
      frameRate: 20
    });

    this.scene.anims.create({
      key: `${this.playerTexture}_crouch`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [9]
      }),
      repeat: 0,
      frameRate: 20
    });
    this.scene.anims.create({
      key: `${this.playerTexture}_jump`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [7]
      }),
      frameRate: 20,
      repeat: 1
    });
    this.scene.anims.create({
      key: `${this.playerTexture}_punch`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [6, 5]
      }),
      frameRate: 15,
      repeat: 0
    });
    this.scene.anims.create({
      key: `${this.playerTexture}_punch_up`,
      frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
        frames: [8, 5]
      }),
      frameRate: 13,
      repeat: 0
    });
  }

  update(): void {
    if (this.playerNumber === 1) {
      this.handleInputForPlayerOne();
    } else {
      this.handleInputForPlayerTwo();
    }

    if (this.flipX) {
      this.body.setOffset(
        PLAYER_CONSTANTS[this.playerTexture].offSetX,
        (PLAYER_CONSTANTS[this.playerTexture].offSetY *= +1)
      );

      this.punchUpHitBox.setPosition(
        this.x - this.hitBoxsPos.punchUp.x,
        this.y - this.hitBoxsPos.punchUp.y
      );
      this.punchHitBox.setPosition(
        this.x - this.hitBoxsPos.punch.x,
        this.y - this.hitBoxsPos.punch.y
      );
    } else {
      this.body.setOffset(
        PLAYER_CONSTANTS[this.playerTexture].offSetX - 120,
        PLAYER_CONSTANTS[this.playerTexture].offSetY
      );

      this.punchHitBox.setPosition(
        this.x + this.hitBoxsPos.punchUp.x,
        this.y + this.hitBoxsPos.punchUp.y
      );
      this.punchUpHitBox.setPosition(
        this.x + this.hitBoxsPos.punch.x,
        this.y + this.hitBoxsPos.punch.y
      );
    }
    this.lifeBar.setDisplaySize(this.life / 4, 30);
  }

  handleInputForPlayerOne(): void {
    this.punchUpHitBox.setAlpha(1);
    this.punchHitBox.setAlpha(1);
    if (!this.anims.isPlaying) {
      this.anims.play(`${this.playerTexture}_idle`, true);
      this.isCrouch = false;
    }

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
      this.punchUpHitBox.setAlpha(1);
      this.checkCollision("player2");
      //punch Up
    } else if (
      Phaser.Input.Keyboard.JustDown(this.player1Controls.shift) &&
      this.body.touching.down &&
      !this.isCrouch
    ) {
      this.anims.play(`${this.playerTexture}_punch_up`, true);
      this.punchUpHitBox.setAlpha(1);
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
    this.punchUpHitBox.setAlpha(0);
    this.punchHitBox.setAlpha(1);
    if (!this.anims.isPlaying) {
      this.anims.play(`${this.playerTexture}_idle`, true);
      this.isCrouch = false;
    }

    // turn & walk
    if (this.player2Controls.A.isDown) {
      this.setFlipX(true);

      if (!this.player2Controls.S.isDown) {
        this.anims.play(`${this.playerTexture}_walk`, true);
        this.setVelocityX(-500);
      }
    } else if (this.player2Controls.D.isDown) {
      this.setFlipX(false);

      if (!this.player2Controls.S.isDown) {
        this.anims.play(`${this.playerTexture}_walk`, true);
        this.setVelocityX(500);
      }
    } else {
      this.setVelocityX(0);
    }

    // jump
    if (this.player2Controls.W.isDown && this.body.touching.down) {
      this.setVelocityY(-2000);
      this.anims.play(`${this.playerTexture}_jump`, true);
    } else if (!this.body.touching.down) {
      this.anims.play(`${this.playerTexture}_jump`, true);
    }

    //punch
    if (
      Phaser.Input.Keyboard.JustDown(this.player2Controls.Q) &&
      this.body.touching.down &&
      !this.isCrouch
    ) {
      this.anims.play(`${this.playerTexture}_punch`, true);
      this.punchUpHitBox.setAlpha(1);
      this.checkCollision("player1");
      //punch Up
    } else if (
      Phaser.Input.Keyboard.JustDown(this.player2Controls.R) &&
      this.body.touching.down &&
      !this.isCrouch
    ) {
      this.anims.play(`${this.playerTexture}_punch_up`, true);
      this.punchUpHitBox.setAlpha(1);
      this.checkCollision("player1");
    }

    //crouch
    if (this.player2Controls.S.isDown) {
      this.anims.play(`${this.playerTexture}_crouch`, true);
      this.setVelocityX(0);
      this.isCrouch = true;
    }
  }

  checkCollision(player: string): void {
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.scene[player].getBounds(),
        this.punchUpHitBox.getBounds()
      )
    ) {
      this.collisionHandler(player);
    }
  }

  collisionHandler(player: string) {
    this.scene[player]["life"] = this.scene[player]["life"] - 50;
    console.log(this.scene[player]["life"]);
  }

  generateHitBoxes() {
    this.punchHitBox = this.scene.add.rectangle(
      this.x + this.hitBoxsPos.punch.x,
      this.y + this.hitBoxsPos.punch.y,
      40,
      40,
      0xff0000,
      0.3
    );

    this.punchUpHitBox = this.scene.add.rectangle(
      this.x + this.hitBoxsPos.punchUp.x,
      this.y + this.hitBoxsPos.punchUp.y,
      40,
      40,
      0xc8d0d9,
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
  }
}
