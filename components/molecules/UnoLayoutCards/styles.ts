import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 20px 0;
  height: 160px;
`;

export const Item = styled.div<{index: number}>`
  position: absolute;
  left: ${(props) => props.index * 10}px;
  &:active {
    z-index: 1000;
  }
`;
