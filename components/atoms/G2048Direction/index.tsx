import {
  FC, useEffect, useState,
} from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Container,
} from './styles';
import { Number } from './Number';
import { Particles } from './Particles';
import { Effects } from './Effects';

type Props = {
  max: number
}

export const G2048Direction: FC<Props> = ({
  max,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    if (max < 1024) return;
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  }, [max]);
  return (
    <Container isVisible={isVisible}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Number number={max} />
        <Particles count={10000} />
        <Effects />
      </Canvas>
    </Container>
  );
};
