import Player from "../objects/player";

export class MainGame extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Sprite;
  private player2: Phaser.Physics.Arcade.Sprite;

  private platforms: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({
      key: "MainGame"
    });
  }

  init(): void {
    this.player = null;
    this.player2 = null;
    this.platforms = null;
  }
  create(): void {
    this.add.image(-100, -30, "bg").setOrigin(0, 0);
    const flame: Phaser.GameObjects.Sprite = this.add
      .sprite(-100, -30, "flame")
      .setOrigin(0, 0);

    this.time.addEvent({
      delay: 500,
      callback: () => {
        flame.alpha = Math.round(Math.random());
      },
      repeat: Infinity
    });

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(890, 1039, "ground");

    this.player = new Player(
      {
        scene: this,
        x: 550,
        y: 100,
        texture: "depardieu"
      },
      1
    );

    this.player2 = new Player(
      {
        scene: this,
        x: 550,
        y: 100,
        texture: "farikk"
      },
      2
    );

    //  Collide the players each other and with boundaries
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player2, this.platforms);
    this.physics.add.collider(this.player2, this.player);
  }

  update() {
    this.player.update();
    this.player2.update();
  }
}
