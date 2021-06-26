import { FC } from 'react';
import {
  Container, Item, Key, Value,
} from './styles';

type Props = any
export const Debug: FC<Props> = (props) => (
  <Container>
    {Object.keys(props).map((key) => (
      <Item key={key}>
        <Key>{key}</Key>
        <Value>{JSON.stringify(props[key])}</Value>
      </Item>
    ))}
  </Container>
);
