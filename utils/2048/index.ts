import { directions } from '@/constants/2048';
import { Block, Direction } from '@/types/2048';

const createRandomNumber = (
  min = 0, max = 3,
): number => Math.floor(Math.random() * (max + 1 - min)) + min;

export const createBlocks = ({
  turn = 0,
  number = 2,
  blocks = [],
}: {
  turn?: number
  number?: number
  blocks?: Block[]
}): Block[] => {
  if (blocks.length > 15) return blocks;
  let block: Block = {
    id: turn,
    col: createRandomNumber(),
    row: createRandomNumber(),
    number,
  };
  let duplicate:boolean = blocks.some((b) => b.row === block.row && b.col === block.col);
  while (duplicate) {
    block = {
      id: turn,
      col: createRandomNumber(),
      row: createRandomNumber(),
      number,
    };
    // eslint-disable-next-line no-loop-func
    duplicate = blocks.some((b) => b.row === block.row && b.col === block.col);
  }
  return [...blocks, block];
};

export const flickLeft = (blocks: Block[]): Block[] => {
  const nextBlocks = [{
    id: 0,
    col: 3,
    row: 0,
    number: 2,
  }];
  return nextBlocks;
};

export const flickRight = (blocks: Block[]): Block[] => {
  const nextBlocks = [{
    id: 0,
    col: 3,
    row: 3,
    number: 2,
  }];
  return nextBlocks;
};

export const flick = (direction: Direction, blocks: Block[]): Block[] => {
  const rowOrColBlocks: Block[][] = [[], [], [], []];
  blocks.map((b) => {
    if (direction === directions.LEFT || direction === directions.RIGHT) {
      rowOrColBlocks[b.col]?.push(b);
    } else {
      rowOrColBlocks[b.row]?.push(b);
    }
    return null;
  });

  const nextRowOrColBlocks: Block[][] = rowOrColBlocks.map((rowOrCol) => {
    let sortedRowOrCol: Block[] = [];
    if (direction === directions.LEFT) {
      sortedRowOrCol = rowOrCol.sort((b1, b2) => (b1.row > b2.row ? 1 : -1));
    } else if (direction === directions.RIGHT) {
      sortedRowOrCol = rowOrCol.sort((b1, b2) => (b1.row > b2.row ? 1 : -1)).reverse();
    } else if (direction === directions.UP) {
      sortedRowOrCol = rowOrCol.sort((b1, b2) => (b1.col > b2.col ? 1 : -1));
    } else {
      sortedRowOrCol = rowOrCol.sort((b1, b2) => (b1.col > b2.col ? 1 : -1)).reverse();
    }

    return sortedRowOrCol.map((block, i) => {
      const { number } = block;
      const pos = direction === directions.LEFT || direction === directions.UP ? i : 3 - i;
      if (sortedRowOrCol[i + 1]?.number === number) {
        sortedRowOrCol.splice(i + 1, 1);
        return {
          ...block,
          number: number * 2,
          row: direction === directions.LEFT || direction === directions.RIGHT ? pos : block.row,
          col: direction === directions.UP || direction === directions.DOWN ? pos : block.col,
        };
      }
      return {
        ...block,
        row: direction === directions.LEFT || direction === directions.RIGHT ? pos : block.row,
        col: direction === directions.UP || direction === directions.DOWN ? pos : block.col,
      };
    });
  });
  return nextRowOrColBlocks.flat().sort((b1, b2) => (b1.id > b2.id ? 1 : -1));
};
