export const cardTypes = {
  NUMBER: 'number',
  SKIP: 'skip',
  DRAW_TWO: 'drawTwo',
  REVERSE: 'reverse',
  WILD: 'wild',
  WILD_DRAW_FOUR: 'wildDrawFour',
} as const;

export const cardTypeLabels = {
  [cardTypes.SKIP]: 'SKIP',
  [cardTypes.DRAW_TWO]: 'DRAW TWO',
  [cardTypes.REVERSE]: 'REVERSE',
  [cardTypes.WILD]: 'WILD',
  [cardTypes.WILD_DRAW_FOUR]: 'DRAW FOUR',
} as const;

export const cardColors = {
  BLUE: 'blue',
  RED: 'red',
  YELLOW: 'yellow',
  GREEN: 'green',
} as const;

export const cardNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const initialPickCount = 7 as const;

export const statusTypes = {
  PREPARATION: 'preparation',
  PREPARE: 'prepare',
  PLAYING: 'playing',
  FINISHED: 'finished',
} as const;
