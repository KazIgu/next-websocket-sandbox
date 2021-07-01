import { directions } from '@/constants/2048';

export type Block = {
  id: number
  number: number
  col: number
  row: number
};

export type Direction = typeof directions[keyof typeof directions]
