import { PieceType, PutableMap } from '@/types';
import { FC } from 'react';
import { Piece } from '@/components/atoms/Piece';
import { Container, Item } from './styles';

type Props = {
  pieces: PieceType[][]
  putableMap: PutableMap
  handleClick: Function
}

export const Board: FC<Props> = ({ pieces, putableMap, handleClick }) => (
  // eslint-disable-next-line react/jsx-curly-brace-presence
  <Container>
    {pieces.map((rows, row) => (
      rows.map((piece, col) => {
        const onClick = () => {
          if (putableMap[row][col]) {
            handleClick(row, col);
          }
        };
        return (
          <Item
          // eslint-disable-next-line react/no-array-index-key
            key={`${row}${col}`}
            data-memo={`${row},${col}`}
            onClick={onClick}
          >
            <Piece pieceType={piece} />
          </Item>

        );
      })
    ))}
  </Container>
);
