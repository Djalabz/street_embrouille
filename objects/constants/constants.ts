export const CONTROLS = {
  player1: {
    UP: Phaser.Input.Keyboard.KeyCodes.UP,
    DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
    LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
    RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    PUNCH: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    PUNCH_UP: Phaser.Input.Keyboard.KeyCodes.SPACE,
    GUARD: Phaser.Input.Keyboard.KeyCodes.L
  },
  player2: {
    UP: Phaser.Input.Keyboard.KeyCodes.W,
    DOWN: Phaser.Input.Keyboard.KeyCodes.S,
    LEFT: Phaser.Input.Keyboard.KeyCodes.A,
    RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
    PUNCH: Phaser.Input.Keyboard.KeyCodes.Q,
    PUNCH_UP: Phaser.Input.Keyboard.KeyCodes.R,
    GUARD: Phaser.Input.Keyboard.KeyCodes.C
  }
};

export const PLAYER_CONSTANTS = {
  depardieu: {
    width: 300,
    height: 350,
    offSetX: 100,
    offSetY: 40,
    YOffset: 0,
    hitBoxsPos: {
      punch: { x: 0, y: -80 },
      punchUp: { x: -30, y: -60 }
    },
    anims: [
      {
        key: "_idle",
        frames: [0, 1, 2],
        yoyo: true,
        repeat: 1,
        frameRate: 4
      },
      {
        key: `_walk`,
        frames: [3, 4, 5],
        repeat: 1,
        frameRate: 20
      },
      { key: `_crouch`, frames: [10], repeat: 0, frameRate: 20 },
      { key: `_jump`, frames: [8], frameRate: 20, repeat: 1 },
      { key: `_punch`, frames: [6, 7, 6], frameRate: 8, repeat: 0 },
      { key: `_punch_up`, frames: [12, 13, 14], frameRate: 10, repeat: 0 },
      { key: `_knocked`, frames: [11], frameRate: 3, repeat: 0 },
      { key: `_guard`, frames: [12], frameRate: 6, repeat: 0 }
    ]
  },
  farikk: {
    width: 300,
    height: 350,
    offSetX: 80,
    offSetY: 40,
    YOffset: 0,
    hitBoxsPos: {
      punch: { x: 0, y: 80 },
      punchUp: { x: 0, y: -50 }
    },
    anims: [
      {
        key: "_idle",
        frames: [1, 2],
        yoyo: true,
        repeat: 1,
        frameRate: 2
      },
      {
        key: `_walk`,
        frames: [0, 1, 2],
        repeat: 1,
        frameRate: 13
      },
      { key: `_crouch`, frames: [9], repeat: 0, frameRate: 20 },
      { key: `_jump`, frames: [7], frameRate: 20, repeat: 1 },
      { key: `_punch`, frames: [5, 6, 5], frameRate: 4, repeat: 0 },
      { key: `_punch_up`, frames: [11, 12, 13], frameRate: 10, repeat: 0 },
      { key: `_knocked`, frames: [10], frameRate: 3, repeat: 0 },
      { key: `_guard`, frames: [11], frameRate: 6, repeat: 0 }
    ]
  }
};
