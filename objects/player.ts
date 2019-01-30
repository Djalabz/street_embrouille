import { PLAYER_CONSTANTS as P } from "./constants/constants";

export class Player extends Phaser.Physics.Arcade.Sprite {
  player1Controls: Phaser.Input.Keyboard.CursorKeys;
  player2Controls: Phaser.Input.Keyboard.Key;
  player1Guard: Phaser.Input.Keyboard.KeyCodes;
  playerTexture: string;
  playerNumber: number;
  life: number;
  lifeBar: Phaser.GameObjects.Rectangle;
  lifeBarBackground: Phaser.GameObjects.Rectangle;
  isCrouch: boolean;
  guard: boolean;

  hitBoxsPos: any;
  punchHitBox: Phaser.GameObjects.Rectangle;
  punchUpHitBox: Phaser.GameObjects.Rectangle;

  constructor(params, playerNumber) {
    super(params.scene, params.x, params.x, params.texture, params.frame);

    this.scene = params.scene;
    this.playerNumber = playerNumber;
    this.playerTexture = params.texture;

    //playerState
    this.life = 2000;
    this.isCrouch = false;
    this.guard = false;
    this.flipX = this.playerNumber === 1 ? true : false;

    this.setDisplaySize(
      P[this.playerTexture].width,
      P[this.playerTexture].height
    );

    // physics
    this.scene.physics.world.enable(this);
    this.setSize(110, 300);
    this.body.setOffset(
      P[this.playerTexture].offSetX,
      P[this.playerTexture].offSetY
    );
    this.setCollideWorldBounds(true);
    this.body.checkCollision.up = false;

    //controls mapping
    this.player1Controls = this.scene.input.keyboard.createCursorKeys();
    this.player2Controls = this.scene.input.keyboard.addKeys("W,S,A,D,Q,R,C");
    this.player1Guard = this.scene.input.keyboard.addKeys("L");

    this.scene.add.existing(this);

    this.generateHitBoxes();
    this.configAnimations();

    new Phaser.Input.Keyboard.KeyCombo(this.scene.input.keyboard, [37, 37], {
      maxKeyDelay: 200,
      resetOnMatch: true
    });

    new Phaser.Input.Keyboard.KeyCombo(this.scene.input.keyboard, [39, 39], {
      maxKeyDelay: 200,
      resetOnMatch: true
    });

    // super COMBO
    this.scene.input.keyboard.on("keycombomatch", event => {
      if (event.current === 37) {
        this.scene["player2"].setVelocityY(-1000);
        this.scene["player2"].setVelocityX(-5000);
        return;
      } else if (event.current === 39) {
        this.scene["player2"].setVelocityY(-1000);
        this.scene["player2"].setVelocityX(5000);
      }
    });
  }
  configAnimations(): void {
    P[this.playerTexture].anims.forEach(anim => {
      this.scene.anims.create({
        key: `${this.playerTexture}${anim.key}`,
        frames: this.scene.anims.generateFrameNumbers(this.playerTexture, {
          frames: anim.frames
        }),
        yoyo: anim.yoyo || false,
        repeat: anim.repeat,
        frameRate: anim.frameRate
      });
    });
  }

  /**
   * Update Method
   */
  update(): void {
    //update life bar
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
    this.punchUpHitBox.setAlpha(0);
    this.punchHitBox.setAlpha(0);
    this.guard = false;

    if (!this.anims.isPlaying) {
      this.anims.play(`${this.playerTexture}_idle`, true);
      this.isCrouch = false;
    }

    // turn & walk
    if (this.player1Controls.left.isDown) {
      if (this.body.touching.down) {
        this.setFlipX(true);
      }

      if (!this.player1Controls.down.isDown) {
        this.anims.play(`${this.playerTexture}_walk`, true);
        this.setVelocityX(-500);
      }
    } else if (this.player1Controls.right.isDown) {
      if (this.body.touching.down) {
        this.setFlipX(false);
      }

      if (!this.player1Controls.down.isDown) {
        this.anims.play(`${this.playerTexture}_walk`, true);
        this.setVelocityX(500);
      }
    } else {
      if (this.body.touching.down) {
        this.setVelocityX(0);
      }
    }

    // jump
    if (this.player1Controls.up.isDown && this.body.touching.down) {
      this.setVelocityY(-2500);
      this.anims.play(`${this.playerTexture}_jump`, true);
    } else if (!this.body.touching.down) {
      this.anims.play(`${this.playerTexture}_jump`, true);
    }

    //punch
    if (
      Phaser.Input.Keyboard.JustDown(this.player1Controls.space) &&
      this.body.touching.down &&
      !this.isCrouch &&
      !this.player1Guard.L.isDown
    ) {
      this.anims.play(`${this.playerTexture}_punch`, true);
      this.punchUpHitBox.setAlpha(1);
      this.checkCollision("player1", this.anims.nextTick);
      //punch Up
    } else if (
      Phaser.Input.Keyboard.JustDown(this.player1Controls.shift) &&
      this.body.touching.down &&
      !this.isCrouch &&
      !this.player1Guard.L.isDown
    ) {
      this.anims.play(`${this.playerTexture}_punch_up`, true);
      this.punchUpHitBox.setAlpha(1);
      this.checkCollision("player1", this.anims.nextTick);
    }

    //crouch
    if (this.player1Controls.down.isDown) {
      this.anims.play(`${this.playerTexture}_crouch`, true);
      this.setVelocityX(0);
      this.setVelocityY(1700);
      this.isCrouch = true;
    }

    //guard
    if (this.player1Guard.L.isDown) {
      this.anims.play(`${this.playerTexture}_guard`, true);
      this.guard = true;
    }
  }

  handleInputForPlayerTwo(): void {
    this.guard = false;
    this.punchUpHitBox.setAlpha(0);
    this.punchHitBox.setAlpha(0);
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
      !this.isCrouch &&
      !this.player2Controls.C.isDown
    ) {
      this.anims.play(`${this.playerTexture}_punch`, true);
      this.punchUpHitBox.setAlpha(1);
      this.checkCollision("player2", this.anims.nextTick);
      //punch Up
    } else if (
      Phaser.Input.Keyboard.JustDown(this.player2Controls.R) &&
      this.body.touching.down &&
      !this.isCrouch &&
      !this.player2Controls.C.isDown
    ) {
      this.anims.play(`${this.playerTexture}_punch_up`, true);
      this.punchUpHitBox.setAlpha(1);
      this.checkCollision("player2", this.anims.nextTick);
    }

    //crouch
    if (this.player2Controls.S.isDown) {
      this.anims.play(`${this.playerTexture}_crouch`, true);
      this.setVelocityX(0);
      this.setVelocityY(1700);
      this.isCrouch = true;
    }

    //guard
    if (this.player2Controls.C.isDown) {
      this.anims.play(`${this.playerTexture}_guard`, true);
      this.guard = true;
    }
  }

  checkCollision(player: string, delay: number): void {
    this.scene.time.addEvent({
      delay,
      callback: () => {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            this.scene[player].getBounds(),
            this.punchUpHitBox.getBounds()
          ) &&
          !this.scene[player]["guard"]
        ) {
          this.handleCollision(player);
        }
      }
    });
  }

  handleCollision(player: string): void {
    this.setDepth(1);
    this.scene[player].setDepth(0);
    this.scene[player]["life"] += -50;
    this.scene[player].anims.play(
      `${this.scene[player].playerTexture}_knocked`
    );
  }

  generateHitBoxes(): void {
    this.punchHitBox = this.scene.add.rectangle(0, 0, 40, 40, 0xff0000, 0.3);
    this.punchUpHitBox = this.scene.add.rectangle(0, 0, 40, 40, 0xc8d0d9, 0.3);

    this.lifeBarBackground = this.scene.add.rectangle(
      this.playerNumber === 2 ? 500 : 1380,
      100,
      500,
      30,
      0xff0000,
      1
    );

    this.lifeBar = this.scene.add.rectangle(
      this.playerNumber === 2 ? 500 : 1380,
      100,
      this.life / 4,
      30,
      0x0ebc79,
      1
    );

    this.lifeBar.setScrollFactor(0);
    this.lifeBarBackground.setScrollFactor(0);
  }
}
