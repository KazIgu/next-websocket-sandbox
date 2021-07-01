import styled from 'styled-components';
import { SwipeableProps } from 'react-swipeable';

export const Wrapper = styled.div<SwipeableProps>`
  position: relative;
`;

export const Container = styled.div`
  background: #004c8c;
  display: grid;
  flex-wrap: wrap;
  grid-template: repeat(4, 1fr) / repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  border: 8px solid #004c8c;
`;

export const Item = styled.div`
  width: 100%;
  padding-top: 100%;
  background: #0277bd;
  box-sizing: border-box;
  overflow:hidden;
  position: relative;
  border-radius: 8px;
`;
