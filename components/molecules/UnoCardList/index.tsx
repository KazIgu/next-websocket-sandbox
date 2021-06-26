import { FC } from 'react';
import { UnoCard } from '@/components/atoms/UnoCard';
import { Card } from '@/types/uno';
import { Container, Item } from './styles';

type Props = {
  cards: Card[]
  selectedCardIndexes?: number[]
  selectCard: (index: number) => void
}

export const UnoCardList: FC<Props> = ({ cards, selectedCardIndexes = [], selectCard }) => (
  <Container>
    {cards.map((card, i) => {
      const handleClick = () => {
        selectCard(i);
      };
      return (
      // eslint-disable-next-line react/no-array-index-key
        <Item key={i} selected={selectedCardIndexes.some((index) => index === i)}>
          <UnoCard card={card} onClick={handleClick} />
        </Item>
      );
    })}
  </Container>
);
