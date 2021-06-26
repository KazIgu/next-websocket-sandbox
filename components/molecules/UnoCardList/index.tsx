import { FC } from 'react';
import { UnoCard } from '@/components/atoms/UnoCard';
import { Card } from '@/types/uno';
import {
  Wrapper, Container, Item, Counter,
} from './styles';

type Props = {
  cards: Card[]
  discard: (index: number) => void
}

export const UnoCardList: FC<Props> = ({ cards, discard }) => (
  <Wrapper>
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
    <Counter>
      残り
      {cards.length}
      枚
    </Counter>
  </Wrapper>
);
