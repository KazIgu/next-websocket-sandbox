import { useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Group } from 'three';
import { Text } from './Text';

export const Number = ({
  number,
}: {
  number: number
}) => {
  const group = useRef<Group>();
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
      group.current.rotation.x = Math.cos(state.clock.elapsedTime) * 0.1;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2;
      group.current.position.x = 0;
    }
  });

  return (
    <Suspense fallback={null}>
      <group ref={group}>
        <Text
          size={0.2}
        >
          {`${number}`}
        </Text>
      </group>
    </Suspense>
  );
};
