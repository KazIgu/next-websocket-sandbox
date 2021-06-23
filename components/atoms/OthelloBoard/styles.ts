import styled from 'styled-components';

export const Container = styled.div`
  background: green;
  display: flex;
  flex-wrap:wrap;
  width: 100%;
  column-count: 8;
`;

export const Item = styled.div`
  width: ${100 / 8}%;
  border: 1px solid #000;
  box-sizing: border-box;
  overflow:hidden;
`;
