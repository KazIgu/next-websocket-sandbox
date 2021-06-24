import { PieceType } from '@/types';
import { FC } from 'react';
import { OthelloPiece } from '@/components/atoms/OthelloPiece';
import { pieceTypes } from '@/constants';
import { Container, OthelloPieceContainer, Button } from './styles';

type Props = {
  turn: PieceType
  myturn: PieceType
  memberCount: number
  guestMode: boolean
  toggleMyturn: () => void
  participate: () => void
}
export const OthelloInfo: FC<Props> = ({
  turn, myturn, memberCount, toggleMyturn, guestMode, participate,
}) => (
  <Container>
    {guestMode ? (
      <>
        <div>
          {turn === pieceTypes.BLACK ? '黒のターン' : '白のターン'}
        </div>
        <Button type="button" onClick={participate}>
          参加する
        </Button>
        <div>
          {memberCount}
          人観戦
        </div>
      </>
    ) : (
      <>
        {
            memberCount > 1 ? (
              <>
                <div>
                  {turn === myturn ? 'あなたのターン' : '相手思考中'}
                </div>
                <OthelloPieceContainer>
                  <OthelloPiece pieceType={myturn} />
                </OthelloPieceContainer>
                <div>
                  {memberCount - 2}
                  人観戦
                </div>
              </>
            ) : (
              <div>
                対戦相手を待っています
              </div>
            )
          }
        <Button type="button" onClick={toggleMyturn}>自分の色を変更</Button>
      </>
    )}
  </Container>
);
