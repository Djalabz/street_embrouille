import Player from "../objects/player";

export class MainGame extends Phaser.Scene {
  private player1: Phaser.Physics.Arcade.Sprite;
  private player2: Phaser.Physics.Arcade.Sprite;

  private platforms: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({
      key: "MainGame"
    });
  }

  init(): void {
    this.player1 = null;
    this.player2 = null;
    this.platforms = null;
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

    //  Collide the players each other and with boundaries
    this.physics.add.collider(this.player1, this.platforms);
    this.physics.add.collider(this.player2, this.platforms);
    this.physics.add.collider(this.player2, this.player1);
  }

  update() {
    this.player1.update();
    this.player2.update();
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

    this.time.addEvent({
      delay: 8000,
      callback: () => {
        window_shadow_2.alpha = Math.round(Math.random());
      },
      repeat: Infinity
    });

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(890, 1039, "ground");
  }
}
