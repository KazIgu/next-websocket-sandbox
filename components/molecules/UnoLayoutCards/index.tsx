import { FC } from 'react';
import { UnoCard } from '@/components/atoms/UnoCard';
import { Card } from '@/types/uno';
import { Container, Item } from './styles';

type Props = {
  cards: Card[]
}

export const UnoLayoutCards: FC<Props> = ({ cards }) => (
  <Container>
    {cards.map((card, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Item key={i} index={i}>
        <UnoCard card={card} />
      </Item>
    ))}
  </Container>
);
