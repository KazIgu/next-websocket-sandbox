import { PieceType } from '@/types';
import { FC } from 'react';
import { Content, Wrapper } from './styles';

type Props = {
  pieceType: PieceType
}
export const OthelloPiece: FC<Props> = ({ pieceType }) => (
  <Wrapper>
    <Content pieceType={pieceType} />
  </Wrapper>
);
