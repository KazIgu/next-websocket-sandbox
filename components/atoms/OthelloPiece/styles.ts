import styled from 'styled-components';
import { PieceType } from '@/types';
import { pieceTypes } from '@/constants';

export const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

export const Content = styled.span<{
  pieceType: PieceType
}>`
  position: absolute;
  display: block;
  width: 80%;
  height: 80%;
  border-radius: 50%;  
  overflow: hidden;
  background-color: ${({ pieceType }) => {
    if (pieceType === pieceTypes.BLACK) return '#000';
    if (pieceType === pieceTypes.WHITE) return '#fff';
    return 'transparent';
  }};
`;
