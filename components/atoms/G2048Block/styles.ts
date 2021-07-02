import styled, { keyframes, css } from 'styled-components';
import Color from 'color';

const opacity = keyframes`
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
`;
export const Wrapper = styled.div<{
  size?: number
  row: number
  col: number
}>`
  box-sizing: border-box;
  overflow:hidden;
  position: absolute;
  color: #fff; 
  top: 8px;
  left: 8px;
  ${({ size = 0, row, col }) => {
    const x = (row * (size + 8));
    const y = (col * (size + 8));
    return css`
      transform: translate3d(${x}px, ${y}px, 0);
    `;
  }}
  transition: transform 0.25s ease-out;
`;

export const BlockItem = styled.div<{
    size?: number
    number?: number
  }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  animation: ${opacity} 0.25s;
  border-radius: 8px;
  font-size: 32px;
  ${({ number = 0 }) => {
    let color = Color('rgb(255, 255, 255)');
    let textColor = color.isLight() ? '#333' : '#ddd';
    let backgroundColor = color.hex();
    if (number < 33) {
      color = color.mix(Color('orange'), number / 32);
      textColor = color.isLight() ? '#333' : '#ddd';
      backgroundColor = color.hex();
    } else if (number < 1025) {
      color = color.mix(Color('red'), (number + 1024) / (1024 + 1024));
      textColor = color.isLight() ? '#333' : '#ddd';
      backgroundColor = color.hex();
    } else {
      color = color.mix(Color('red'), (number + 1024) / (1024 + 1024));
      textColor = '#fff';
      backgroundColor = '#333';
    }
    return css`
      color: ${textColor};
      background: ${backgroundColor};
    `;
  }}
  display: flex;
  align-items: center;
  justify-content: center;
`;
