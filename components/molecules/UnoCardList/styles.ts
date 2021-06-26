import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 20px 0;
`;

export const Item = styled.div<{selected: boolean}>`
  margin: 12px 2px;
  transform: translateY(${(props) => (props.selected ? '-12px' : '0')}) scale(${(props) => (props.selected ? '1.1' : '1')});
  z-index: ${(props) => (props.selected ? '1' : 'auto')};
  transition: all 0.25s ease-out;
`;
