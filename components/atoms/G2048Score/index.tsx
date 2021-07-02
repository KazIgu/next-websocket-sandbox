import { FC } from 'react';
import { Block } from '@/types/2048';
import {
  Container, Item, Label, Value,
} from './styles';

type Props = {
  blocks: Block[]
}

export const G2048Score: FC<Props> = ({
  blocks,
}) => (
  <Container>
    <Item>
      <Label>スコア</Label>
      <Value>{blocks.reduce((score, current) => score + current.number, 0)}</Value>
    </Item>
  </Container>
);
