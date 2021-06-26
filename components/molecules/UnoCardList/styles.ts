import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 20px 8px;
  position: relative;
`;

export const Container = styled.div`
  width: auto;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  margin: 0 8px;
`;

export const Item = styled.div`
  margin: 12px 2px;
  width: 60px;
`;

export const Counter = styled.span`
  position: absolute;
  bottom: 0;
  right: 8px;
`;
