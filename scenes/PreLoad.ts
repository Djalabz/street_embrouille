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

    this.load.spritesheet("blood", "assets/blood.png", {
      frameHeight: 510,
      frameWidth: 520
    });

    this.load.spritesheet("cat", "assets/cat.png", {
      frameHeight: 60,
      frameWidth: 60
    });

    //characters
    this.load.spritesheet("depardieu", "assets/depardieu.png", {
      frameWidth: 300,
      frameHeight: 350
    });

    this.load.spritesheet("farikk", "assets/farikk.png", {
      frameWidth: 300,
      frameHeight: 350
    });

    //audio
    this.load.audio("music", "assets/streetembrouille_bo.mp3");
  }
  update(): void {
    this.scene.start("MainGame");
  }
}
