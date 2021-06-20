import { pieceTypes, directions } from '@/constants';

export type PieceType = typeof pieceTypes[keyof typeof pieceTypes]
export type Pieces = PieceType[][]
export type Direction = typeof directions[keyof typeof directions]

// [row,col]
export type Point = [number, number];

export type PutableMap = boolean[][]

export type DirectionPoint = Point | undefined;
export type DirectionPoints = {
  [key: string]: DirectionPoint
}
