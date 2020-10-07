import { Player } from "../objects/player";

export class MainGame extends Phaser.Scene {
  player1: Phaser.Physics.Arcade.Sprite;
  player2: Phaser.Physics.Arcade.Sprite;

  camera: Phaser.Cameras.Scene2D.Camera;
  ground: Phaser.Physics.Arcade.StaticGroup;
  music: Phaser.Sound.BaseSound;

  constructor() {
    super({
      key: "MainGame"
    });
  }

  init(): void {
    this.ground = null;
  }

  resize() {
    var canvas = this.game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
    canvas.style.width = width + 'px';
    canvas.style.height = (width / ratio) + 'px';
    } else {
    canvas.style.width = (height * ratio) + 'px';
    canvas.style.height = height + 'px';
}

    window.onresize = this.resize;

}

  create(): void {
    window.addEventListener('resize', this.resize);
    this.resize();

    this.music = this.sound.add("music", { loop: true });
    this.music.play();

    this.loadDecorations();

    this.player2 = new Player(
      {
        scene: this,
        x: 0,
        y: 0,
        texture: "depardieu",
        frame: 0
      },
      1
    );

    this.player2.x = 1200;
    this.player2.y = 100;

    this.player1 = new Player(
      {
        scene: this,
        x: 0,
        y: 0,
        texture: "farikk",
        frame: 0
      },
      2
    );
    this.player1.x = 200;
    this.player1.y = 100;

    //camera
    this.camera = this.cameras.main
      .setBounds(0, 0, 1920, 1080, true)
      .startFollow(this.player1, true, 0.05, 0.05)
      .setZoom(1.13);

    //  Collide the players each other and with ground
    this.physics.add.collider(this.player1, this.ground);
    this.physics.add.collider(this.player2, this.ground);
    this.physics.add.collider(this.player2, this.player1);
  }

  update() {
    this.player1.update();
    this.player2.update();

    if (!this.player1["life"]) {
      alert("player 1 defeated");
      this.music.stop();
      this.scene.restart();
    } else if (!this.player2["life"]) {
      alert("player 2 defeated");
      this.music.stop();
      this.scene.restart();
    }
  }

  loadDecorations(): void {
    // load background
    this.add.image(0, 0, "bg").setOrigin(0, 0);

    const flame: Phaser.GameObjects.Sprite = this.add
      .sprite(0, 0, "flame")
      .setOrigin(0, 0);

    const window_shadow: Phaser.GameObjects.Sprite = this.add
      .sprite(0, 0, "window_shadow")
      .setOrigin(0, 0);

    const window_shadow_2: Phaser.GameObjects.Sprite = this.add
      .sprite(0, 0, "window_shadow_2")
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

    const cat: Phaser.GameObjects.Sprite = this.add.sprite(760, 600, "cat");
    cat.setFlipX(true);

    this.anims.create({
      key: "cat",
      repeat: Infinity,
      frames: this.anims.generateFrameNumbers("cat", {
        start: 0,
        end: 3
      }),
      frameRate: 4,
      yoyo: true
    });

    cat.anims.play("cat");

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
    this.ground.create(990, 1070, "ground");
  }
}
