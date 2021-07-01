import { FC } from 'react';
import { Block } from '@/types/2048';
import { Wrapper, BlockItem } from './styles';

type Props = {
  block: Block
  size?: number
}

export const G2048Block: FC<Props> = ({
  block,
  size,
}) => (
  <Wrapper
    size={size}
    row={block.row}
    col={block.col}
  >
    <BlockItem
      size={size}
      number={block.number}
    >
      {block.number}
    </BlockItem>
  </Wrapper>
);
