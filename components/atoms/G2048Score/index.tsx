import { FC } from 'react';
import { Block } from '@/types/2048';
import {
  Container, Item, Label, Value, Revision,
} from './styles';

type Props = {
  blocks: Block[]
  highScore: number
  refresh: () => void
}

export const G2048Score: FC<Props> = ({
  blocks,
  highScore,
  refresh,
}) => (
  <Container>
    <Item>
      <Label>スコア</Label>
      <Value>{blocks.reduce((score, current) => score + current.number, 0)}</Value>
    </Item>
    <Item>
      <Label>ハイスコア</Label>
      <Value>{highScore}</Value>
    </Item>
    <Revision onClick={refresh} />
  </Container>
);
