import styled from 'styled-components';
import Color from 'color';
import { Revision as RevisionIcon } from '@styled-icons/boxicons-regular/Revision'

const backgroundColor = Color('#01579b');

export const Container = styled.div`
  background: ${backgroundColor.hsl().string()};
  display: flex;
  height: 80px;
  color: #fff;
  padding: 8px 16px;
  box-sizing: content-box;
  justify-content: space-between;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Label = styled.div`
  font-size: 10px;
  width: 100%;
  text-align:left;
`;

export const Value = styled.div`
  font-size: 32px;
  width: 100%;
  text-align:left;
`;

export const Revision = styled(RevisionIcon)`
  width: 40px;
`