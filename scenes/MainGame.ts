import Player from "../objects/player";
import { delay } from "q";

export class MainGame extends Phaser.Scene {
  private player1: Phaser.Physics.Arcade.Sprite;
  private player2: Phaser.Physics.Arcade.Sprite;

  private ground: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({
      key: "MainGame"
    });
  }

  init(): void {
    this.player1 = null;
    this.player2 = null;
    this.ground = null;
  }
  create(): void {
    this.loadDecorations();

    this.player1 = new Player(
      {
        scene: this,
        x: 550,
        y: 100,
        texture: "depardieu",
        frame: 0
      },
      1
    );

    this.player2 = new Player(
      {
        scene: this,
        x: 850,
        y: 100,
        texture: "farikk",
        frame: 0
      },
      2
    );

    //  Collide the players each other and with ground
    this.physics.add.collider(this.player1, this.ground);
    this.physics.add.collider(this.player2, this.ground);
    this.physics.add.collider(this.player2, this.player1);
  }

  update() {
    this.player1.update();
    this.player2.update();

    if(!this.player1["life"] || !this.player2["life"]){
      alert("player is died")
    }
  }

  loadDecorations(): void {
    this.add.image(-100, -30, "bg").setOrigin(0, 0);
    const flame: Phaser.GameObjects.Sprite = this.add
      .sprite(-100, -30, "flame")
      .setOrigin(0, 0);

    const window_shadow: Phaser.GameObjects.Sprite = this.add
      .sprite(-100, -30, "window_shadow")
      .setOrigin(0, 0);

    const window_shadow_2: Phaser.GameObjects.Sprite = this.add
      .sprite(-100, -30, "window_shadow_2")
      .setOrigin(0, 0);

    this.time.addEvent({
      delay: 50,
      callback: () => {
        flame.alpha = Math.round(Math.random());
      },
      repeat: Infinity
    });

    this.time.addEvent({
      delay: 5000,
      callback: () => {
        window_shadow.alpha = Math.round(Math.random());
      },
      repeat: Infinity
    });

    const cat: Phaser.GameObjects.Sprite = this.add.sprite(662, 570, "cat");
    cat.setFlipX(true);

    this.anims.create({
      key: "cat",
      repeat: 3,
      frames: this.anims.generateFrameNumbers("cat", {
        start: 0,
        end: 3
      }),
      frameRate: 2,
      yoyo: true
    });

    cat.anims.play("cat");

    this.time.addEvent{
      delay:1000
    }

    this.time.addEvent({
      delay: 8000,
      callback: () => {
        window_shadow_2.alpha = Math.round(Math.random());
      },
      repeat: Infinity
    });

    this.time.addEvent({
      delay: 8000,
      callback: () => {
        window_shadow_2.alpha = Math.round(Math.random());
      },
      repeat: Infinity
    });

    this.ground = this.physics.add.staticGroup();
    this.ground.create(890, 1039, "ground");
  }
}
