import { pieceTypes } from '@/constants';
import {
  Pieces, PieceType, Direction, Point, DirectionPoint, DirectionPoints, PutableMap,
} from '@/types';

// 初期表示
export const setInitialPieces = (): Pieces => {
  const pieces: Pieces = [...Array(8)].map(() => [...Array(8)].map(() => pieceTypes.EMPTY));
  pieces[3][3] = pieceTypes.WHITE;
  pieces[4][4] = pieceTypes.WHITE;
  pieces[3][4] = pieceTypes.BLACK;
  pieces[4][3] = pieceTypes.BLACK;
  return pieces;
};

// ポイントの周囲の座標を取得
export const getDirectionPoints = (point: Point): DirectionPoints => {
  const row = point[0];
  const col = point[1];
  const up: DirectionPoint = row > 0 ? [row - 1, col] : undefined;
  const down: DirectionPoint = row < 7 ? [row + 1, col] : undefined;
  const left: DirectionPoint = col > 0 ? [row, col - 1] : undefined;
  const right: DirectionPoint = col < 7 ? [row, col + 1] : undefined;
  const upLeft: DirectionPoint = row > 0 && col > 0 ? [row - 1, col - 1] : undefined;
  const upRight: DirectionPoint = row > 0 && col < 7 ? [row - 1, col + 1] : undefined;
  const downLeft: DirectionPoint = row < 7 && col > 0 ? [row + 1, col - 1] : undefined;
  const downRight: DirectionPoint = row < 7 && col < 7 ? [row + 1, col + 1] : undefined;
  const points: DirectionPoints = {
    up,
    down,
    left,
    right,
    upLeft,
    upRight,
    downLeft,
    downRight,
  };
  return points;
};

// 駒を返せるか指定された方向を追って確認
const detectPutableDirection = ({
  turn,
  point,
  pieces,
  direction,
}: {
  turn: PieceType,
  point: Point,
  pieces: Pieces,
  direction: Direction,
}): boolean => {
  const enemiesPieceType = turn === pieceTypes.BLACK ? pieceTypes.WHITE : pieceTypes.BLACK;
  let targetPiece = getDirectionPoints(point)[direction];
  if (!targetPiece || pieces[targetPiece[0]][targetPiece[1]] !== enemiesPieceType) return false;
  let loopFlag = true;
  let putable = false;
  while (
    targetPiece
    && loopFlag
  ) {
    if (pieces[targetPiece[0]][targetPiece[1]] === turn) {
      loopFlag = false;
      putable = true;
    }
    targetPiece = getDirectionPoints(targetPiece)[direction];
  }
  return putable;
};

// 置ける場所を取得
export const getPutablePlace = (pieces: Pieces, turn: PieceType): PutableMap => {
  const putableMap: PutableMap = pieces.map((rows, row) => {
    const rowMap = rows.map((piece, col) => {
      // すでに駒が置かれていればunputable
      if (piece !== pieceTypes.EMPTY) {
        return false;
      }

      const point: Point = [row, col];
      const targetPoints: DirectionPoints = getDirectionPoints(point);
      const putable = Object.keys(targetPoints).some((key) => {
        const target = targetPoints[key];
        return target && detectPutableDirection({
          turn,
          point,
          pieces,
          direction: key as Direction,
        });
      });
      return putable;
    });
    return rowMap;
  });
  return putableMap;
};

// 駒を置いたときに反転される駒を返す
export const putPiece = (pieces: Pieces, turn: PieceType, point: Point): Point[] => {
  const enemiesPieceType = turn === pieceTypes.BLACK ? pieceTypes.WHITE : pieceTypes.BLACK;
  const targetPoints: DirectionPoints = getDirectionPoints(point);
  const reversiblePieces: Point[] = [];
  Object.keys(targetPoints).map((key) => {
    let targetPiece = targetPoints[key];
    if (!detectPutableDirection({
      pieces,
      turn,
      point,
      direction: key as Direction,
    })) return key;
    if (!targetPiece || pieces[targetPiece[0]][targetPiece[1]] !== enemiesPieceType) return false;
    let loopFlag = true;
    while (
      targetPiece
      && loopFlag
    ) {
      if (pieces[targetPiece[0]][targetPiece[1]] === turn) {
        loopFlag = false;
      } else {
        reversiblePieces.push(targetPiece);
        targetPiece = getDirectionPoints(targetPiece)[key];
      }
    }
    return key;
  });
  return reversiblePieces;
};
