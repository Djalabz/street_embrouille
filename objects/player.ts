import { PLAYER_CONSTANTS as P } from "./constants/constants";
import { CONTROLS } from "./constants/constants";

export class Player extends Phaser.Physics.Arcade.Sprite {
  controls: any;
  playerTexture: string;
  playerNumber: number;
  enemyNumber: number;
  life: number;
  lifeBar: Phaser.GameObjects.Rectangle;
  lifeBarBackground: Phaser.GameObjects.Rectangle;
  isCrouch: boolean;
  guard: boolean;

  hitBoxsPos: any;
  punchHitBox: Phaser.GameObjects.Rectangle;
  punchUpHitBox: Phaser.GameObjects.Rectangle;

  step: number = 0;

  constructor(params, playerNumber) {
    super(params.scene, params.x, params.x, params.texture, params.frame);

    this.scene = params.scene;
    this.playerNumber = playerNumber;
    this.enemyNumber = playerNumber === 1 ? 1 : 2;
    this.playerTexture = params.texture;

    // Player states
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
    this.body.setOffset(
      P[this.playerTexture].offSetX,
      P[this.playerTexture].offSetY
    );
    this.setCollideWorldBounds(true);
    this.body.checkCollision.up = false;
    this.setSize(110, 300);

    // Controls mapping
    this.controls = this.scene.input.keyboard.addKeys(
      CONTROLS["player" + playerNumber]
    );

    // Adding player to scene, yes it's weird but this is what it is :)
    this.scene.add.existing(this);

    this.generateHitBoxes();
    this.generateLifeBar();
    this.configAnimations();

    // super COMBO touch event listener with delay
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

    this.scene.anims.create({
      key: `${this.playerTexture}_blood`,
      frames: this.scene.anims.generateFrameNumbers("blood", {
        frames: [0, 1, 2, 3, 4]
      }),
      frameRate: 20
    });
  }

  /**
   * Update Method
   */
  update(): void {
    //update life bar
    this.lifeBar.setDisplaySize(this.life / 4, 30);

    this.handleInput();

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
  /**
   * Handle input of player
   */
  handleInput(): void {
    this.punchUpHitBox.setAlpha(0);
    this.punchHitBox.setAlpha(0);
    this.guard = false;

    if (!this.anims.isPlaying) {
      this.anims.play(`${this.playerTexture}_idle`, true);
      this.isCrouch = false;
    }

    // turn & walk
    if (this.controls.LEFT.isDown) {
      if (this.body.touching.down) {
        this.setFlipX(true);
      }

      if (!this.controls.DOWN.isDown) {
        this.anims.play(`${this.playerTexture}_walk`, true);
        this.setVelocityX(-500);
      }
    } else if (this.controls.RIGHT.isDown) {
      if (this.body.touching.down) {
        this.setFlipX(false);
      }

      if (!this.controls.DOWN.isDown) {
        this.anims.play(`${this.playerTexture}_walk`, true);
        this.setVelocityX(500);
      }
    } else {
      if (this.body.touching.down) {
        this.setVelocityX(0);
      }
    }

    // jump
    if (this.controls.UP.isDown && this.body.touching.down) {
      this.setVelocityY(-2500);
      this.anims.play(`${this.playerTexture}_jump`, true);
    } else if (!this.body.touching.down) {
      this.anims.play(`${this.playerTexture}_jump`, true);
    }

    //punch
    if (
      Phaser.Input.Keyboard.JustDown(this.controls.PUNCH) &&
      this.body.touching.down &&
      !this.isCrouch &&
      !this.controls.GUARD.isDown
    ) {
      this.anims.play(`${this.playerTexture}_punch`, true);
      this.checkCollision(`player${this.enemyNumber}`, this.anims.nextTick);

      //punch Up
    } else if (
      Phaser.Input.Keyboard.JustDown(this.controls.PUNCH_UP) &&
      this.body.touching.down &&
      !this.isCrouch &&
      !this.controls.GUARD.isDown
    ) {
      this.anims.play(`${this.playerTexture}_punch_up`, true);
      this.checkCollision(`player${this.enemyNumber}`, this.anims.nextTick);
    }

    //crouch
    if (this.controls.DOWN.isDown) {
      this.anims.play(`${this.playerTexture}_crouch`, true);
      this.setVelocityX(0);
      this.setVelocityY(1700);
      this.isCrouch = true;
    }

    //guard
    if (this.controls.GUARD.isDown) {
      this.anims.play(`${this.playerTexture}_guard`, true);
      this.guard = true;
    }
  }

  checkCollision(enemy: string, delay: number): void {
    this.scene.time.addEvent({
      delay,
      callback: () => {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            this.scene[enemy].getBounds(),
            this.punchUpHitBox.getBounds()
          ) &&
          !this.scene[enemy]["guard"]
        ) {
          this.handleCollision(enemy);
        }
      }
    });
  }

  handleCollision(enemy: string): void {
    this.setDepth(1);
    this.scene[enemy].setDepth(0);
    this.scene[enemy]["life"] += -50;
    this.scene[enemy].anims.play(`${this.scene[enemy].playerTexture}_knocked`);
    this.pushPlayer(enemy, 2, 20, 4);
    new Phaser.Physics.Arcade.Sprite(this.scene, 200, 200, "blood");
  }

  /**
   * Will push a player, its a looped method where you can set in detail
   *
   * @param enemy the enemy key string
   * @param velocity distance the enemy is traveling beetwen each step
   * @param distance overall distance the enemy will travel
   * @param speed speed between each steps
   */
  pushPlayer(
    enemy: string,
    velocity: number,
    distance: number,
    speed: number
  ): void {
    const MaxPushStep = distance;

    if (this.step === MaxPushStep || this.flipX === this.scene[enemy].flipX) {
      this.step = 0;
      return;
    }

    this.scene[enemy].x = this.scene[enemy].flipX
      ? this.scene[enemy].x + velocity
      : this.scene[enemy].x - velocity;

    this.step++;
    setTimeout(() => this.pushPlayer(enemy, velocity, distance, speed), speed);
  }

  generateHitBoxes(): void {
    this.punchHitBox = this.scene.add.rectangle(0, 0, 40, 40, 0xff0000, 0.3);
    this.punchUpHitBox = this.scene.add.rectangle(0, 0, 40, 40, 0xc8d0d9, 0.3);
  }

  generateLifeBar(): void {
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
