import styled, { css } from 'styled-components';

export const Container = styled.div<{isVisible: boolean}>`
    position: fixed;
    z-index: -1;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    opacity: 0;
    transition: all 0.4s ease-out;

  ${({ isVisible }) => (isVisible && css`
    opacity: 1;
    z-index: 5;
  `)}
`;
