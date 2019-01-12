export class Preload extends Phaser.Scene {
  constructor() {
    super({
      key: "Preload"
    });
  }

  preload(): void {
    this.load.image("bg", "assets/bg.png");
    this.load.image("ground", "assets/ground.png");

    this.load.image("flame", "assets/flame.png");

    this.load.spritesheet("dude", "assets/depardieu.png", {
      frameWidth: 160,
      frameHeight: 303
    });

    this.load.spritesheet("farikk", "assets/farikk.png", {
      frameWidth: 160,
      frameHeight: 303
    });
  }
  update(): void {
    this.scene.start("MainGame");
  }
}
