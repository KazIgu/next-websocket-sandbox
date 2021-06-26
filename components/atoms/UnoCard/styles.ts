import { cardTypes } from '@/constants/uno';
import { CardColor, CardType } from '@/types/uno';
import styled from 'styled-components';

export const Container = styled.div<{cardColor?: CardColor, reverse: boolean}>`
  width: 90px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 4px solid #fff;
  border-radius: 12px;
  box-shadow: 4px 0 8px rgba(0,0,0,0.3);
  background: ${(props) => (props.reverse ? 'black' : props.cardColor || 'black')};
  flex-shrink: 0;
  /* &::before {
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
    background: rgba(0,0,0,0.2);
    border-radius: 12px;
  } */
`;

export const Item = styled.div<{cardType: CardType}>`
  font-size: ${(props) => (props.cardType === cardTypes.NUMBER ? '30px' : '16px')};
  color: #fff;
  text-align: center;
  position: relative;
  text-align: center;
  svg {
    width: 40px;
    height: 40px;
    overflow: visible;
  }
  text {
    fill: #fff;
    stroke-linejoin: round;
    font-weight: bold;
    white-space: pre;
    /* transform: translate(50%, 50%); */
    /* left: 50%; */
    &:first-child {
      stroke: #000;
      stroke-width: 8;
    }
  }
`;
