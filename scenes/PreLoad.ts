export class Preload extends Phaser.Scene {
  constructor() {
    super({
      key: "Preload"
    });
  }

  preload(): void {
    //background
    this.load.image("bg", "assets/bg.png");
    //floor
    this.load.image("ground", "assets/ground.png");

    //decorations
    this.load.image("flame", "assets/flame.png");
    this.load.image("window_shadow", "assets/window_shadow.png");
    this.load.image("window_shadow_2", "assets/window_shadow_2.png");

    //characters
    this.load.spritesheet("depardieu", "assets/depardieu.png", {
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
