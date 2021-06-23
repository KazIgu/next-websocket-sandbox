import { PieceType, PutableMap } from '@/types';
import { FC } from 'react';
import { OthelloPiece } from '@/components/atoms/OthelloPiece';
import { Overlay } from '@/components/atoms/Overlay';
import { Container, Item } from './styles';

type Props = {
  pieces: PieceType[][]
  putableMap: PutableMap
  handleClick: Function
  isMyturn: boolean
}

export const OthelloBoard: FC<Props> = ({
  isMyturn, pieces, putableMap, handleClick,
}) => (
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
            <OthelloPiece pieceType={piece} />
          </Item>

        );
      })
    ))}
    {!isMyturn && <Overlay />}
  </Container>
);
