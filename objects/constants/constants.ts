export const PLAYER_CONSTANTS = {
  depardieu: {
    width: 300,
    height: 350,
    offSetX: 160,
    offSetY: 40,
    YOffset: 120,
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
      { key: `_crouch`, frames: [9], repeat: 0, frameRate: 20 },
      { key: `_jump`, frames: [7], frameRate: 20, repeat: 1 },
      { key: `_punch`, frames: [6], frameRate: 10, repeat: 0 },
      { key: `_punch_up`, frames: [8], frameRate: 10, repeat: 0 },

      { key: `_knocked`, frames: [10], frameRate: 6, repeat: 0 }
    ]
  },
  farikk: {
    width: 150,
    height: 305,
    offSetX: 20,
    offSetY: 0,
    YOffset: 0,
    hitBoxsPos: {
      punch: { x: 0, y: 80 },
      punchUp: { x: 0, y: 0 }
    },
    anims: [
      {
        key: "_idle",
        frames: [0, 1, 2],
        yoyo: true,
        repeat: 1,
        frameRate: 5
      },
      {
        key: `_walk`,
        frames: [0, 1, 2, 3],
        repeat: 1,
        frameRate: 20
      },
      { key: `_crouch`, frames: [7], repeat: 0, frameRate: 20 },
      { key: `_jump`, frames: [5], frameRate: 20, repeat: 1 },
      { key: `_punch`, frames: [4], frameRate: 10, repeat: 0 },
      { key: `_punch_up`, frames: [6], frameRate: 10, repeat: 0 },

      { key: `_knocked`, frames: [1], frameRate: 6, repeat: 0 }
    ]
  }
};
