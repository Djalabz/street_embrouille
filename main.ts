import "phaser";
import { MainGame } from "./scenes/MainGame";
import { Preload } from "./scenes/PreLoad";

const config: GameConfig = {
  type: Phaser.AUTO,
  width: 1980,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 6000 },
      debug: false
    }
  },
  scene: [Preload, MainGame]
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  var game = new Game(config);
});
