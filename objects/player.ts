import { PLAYER_CONSTANTS as P } from "./constants/constants";
export default class Player extends Phaser.Physics.Arcade.Sprite {
  private player1Controls: Phaser.Input.Keyboard.CursorKeys;
  private player2Controls: Phaser.Input.Keyboard.Key;
  private playerTexture: string;
  private playerNumber: number;
  private life: number;
  private lifeBar: Phaser.GameObjects.Rectangle;
  private lifeBarBackground: Phaser.GameObjects.Rectangle;
  private isCrouch: boolean;

  private hitBoxsPos: any;
  private punchHitBox: Phaser.GameObjects.Rectangle;
  private punchUpHitBox: Phaser.GameObjects.Rectangle;

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
      P[this.playerTexture].width,
      P[this.playerTexture].height
    );

    // physics
    this.scene.physics.world.enable(this);
    this.body.setSize(110, 300);
    this.body.setOffset(
      P[this.playerTexture].offSetX,
      P[this.playerTexture].offSetY
    );
    this.setCollideWorldBounds(true);
    this.body.setMass(123);
    this.body.checkCollision.up = false;

    //controls mapping
    this.player1Controls = this.scene.input.keyboard.createCursorKeys();
    this.player2Controls = this.scene.input.keyboard.addKeys("W,S,A,D,Q,R");

    this.scene.add.existing(this);

    this.generateHitBoxes();
    this.configAnimations();
  }
  configAnimations(): void {
    P[this.playerTexture].anims.forEach(anim => {
      this.scene.anims.create({
        key: `${this.playerTexture}${anim.key}`,
        frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
          frames: anim.frames
        }),
        yoyo: anim.yoyo,
        repeat: anim.repeat,
        frameRate: anim.frameRate
      });
    });
  }

  /**
   * Update Method
   */
  update(): void {
    //update lifebar
    this.lifeBar.setDisplaySize(this.life / 4, 30);

    if (this.playerNumber === 1) {
      this.handleInputForPlayerOne();
    } else {
      this.handleInputForPlayerTwo();
    }

    //flipX hitBoxes positions
    if (this.flipX) {
      this.body.setOffset(
        P[this.playerTexture].offSetX,
        (P[this.playerTexture].offSetY *= +1)
      );
      this.punchUpHitBox.setPosition(
        this.body.center.x +
          P[this.playerTexture].hitBoxsPos.punchUp.x -
          this.body.width,
        this.body.center.y + P[this.playerTexture].hitBoxsPos.punchUp.y
      );
      this.punchHitBox.setPosition(
        this.body.center.x +
          P[this.playerTexture].hitBoxsPos.punch.x -
          this.body.width,
        this.body.center.y + P[this.playerTexture].hitBoxsPos.punch.y
      );
    } else {
      this.body.setOffset(
        P[this.playerTexture].offSetX - P[this.playerTexture].YOffset,
        P[this.playerTexture].offSetY
      );

      this.punchUpHitBox.setPosition(
        this.body.center.x +
          P[this.playerTexture].hitBoxsPos.punchUp.x +
          this.body.width,
        this.body.center.y +
          P[this.playerTexture].hitBoxsPos.punchUp.x +
          P[this.playerTexture].hitBoxsPos.punchUp.y
      );
      this.punchHitBox.setPosition(
        this.body.center.x +
          P[this.playerTexture].hitBoxsPos.punch.x +
          this.body.width,
        this.body.center.y + P[this.playerTexture].hitBoxsPos.punch.y
      );
    }
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
    this.punchUpHitBox.setAlpha(1);
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
    this.scene[player].anims.play(
      `${this.scene[player].playerTexture}_knocked`
    );
  }

  generateHitBoxes() {
    this.punchHitBox = this.scene.add.rectangle(0, 0, 40, 40, 0xff0000, 0.3);
    this.punchUpHitBox = this.scene.add.rectangle(0, 0, 40, 40, 0xc8d0d9, 0.3);

    this.lifeBarBackground = this.scene.add.rectangle(
      this.playerNumber === 2 ? 300 : 1380,
      20,
      500,
      30,
      0xff0000,
      1
    );

    this.lifeBar = this.scene.add.rectangle(
      this.playerNumber === 2 ? 300 : 1380,
      20,
      this.life / 4,
      30,
      0x0ebc79,
      1
    );
  }
}
