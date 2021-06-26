import {
  cardTypes, cardColors, cardNumbers, statusTypes,
} from '@/constants/uno';

export type CardType = typeof cardTypes[keyof typeof cardTypes];
export type CardColor = typeof cardColors[keyof typeof cardColors];
export type CardNumber = typeof cardNumbers[number];
export type StatusType = typeof statusTypes[keyof typeof statusTypes];

export type Card = {
  type: CardType
  color?: CardColor
  number?: number
}
