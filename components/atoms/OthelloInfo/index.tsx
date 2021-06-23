import { PieceType } from '@/types';
import { FC } from 'react';
import { OthelloPiece } from '@/components/atoms/OthelloPiece';
import { Container, OthelloPieceContainer, ChangePieceTypeButton } from './styles';

type Props = {
  turn: PieceType
  myturn: PieceType
  toggleMyturn: () => void
}
export const OthelloInfo: FC<Props> = ({ turn, myturn, toggleMyturn }) => (
  <Container>
    <OthelloPieceContainer>
      <OthelloPiece pieceType={myturn} />
    </OthelloPieceContainer>
    <div>
      {turn === myturn ? 'あなたのターン' : '相手思考中'}
    </div>
    <ChangePieceTypeButton type="button" onClick={toggleMyturn}>自分の色を変更</ChangePieceTypeButton>
  </Container>
);
