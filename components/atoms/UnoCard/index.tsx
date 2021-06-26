import { FC } from 'react';
import { Card } from '@/types/uno';
import { cardTypes, cardTypeLabels } from '@/constants/uno';
import { Container, Item } from './styles';

type Props = {
  card: Card
  reverse?: boolean
  onClick?: () => void
}

export const UnoCard: FC<Props> = ({
  card,
  reverse = false,
  onClick = () => {},
}) => (
  <Container cardColor={card.color} onClick={onClick} reverse={reverse}>
    {reverse ? (
      // 裏
      <div>裏</div>
    ) : (
      <Item cardType={card.type}>
        <svg>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
            {card.type === cardTypes.NUMBER ? card.number : cardTypeLabels[card.type]}
          </text>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" white-space="pre">
            {card.type === cardTypes.NUMBER ? card.number : cardTypeLabels[card.type]}
          </text>
        </svg>
      </Item>
    )}
  </Container>
);
