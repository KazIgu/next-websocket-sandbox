import { FC } from 'react';
import { UnoCard } from '@/components/atoms/UnoCard';
import { Card } from '@/types/uno';
import { Container, Item } from './styles';

type Props = {
  cards: Card[]
  discard: (index: number) => void
}

export const UnoCardList: FC<Props> = ({ cards, discard }) => (
  <Container>
    {cards.map((card, i) => {
      const handleClick = () => {
        discard(i);
      };
      return (
      // eslint-disable-next-line react/no-array-index-key
        <Item key={i}>
          <UnoCard card={card} onClick={handleClick} />
        </Item>
      );
    })}
  </Container>
);
