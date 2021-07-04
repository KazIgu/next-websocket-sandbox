import { Vector3, FontLoader, Mesh } from 'three';
import {
  useLayoutEffect, useMemo, useRef,
} from 'react';
import { useLoader } from '@react-three/fiber';

export const Text = ({
  children = '',
  size = 1,
}) => {
  const mesh = useRef<Mesh>();
  const font = useLoader(FontLoader, '/Festive-Regular.json');
  const config = useMemo(() => ({
    font,
    size: 30,
    height: 2,
    position: [0, 0, 0],
  }), [font]);

  useLayoutEffect(() => {
    const meshSize = new Vector3();
    if (!mesh.current) return;
    mesh.current.geometry.computeBoundingBox();
    mesh.current.geometry.boundingBox!.getSize(meshSize);
    mesh.current.position.x = -meshSize.x / 2;
    mesh.current.position.y = -meshSize.y / 2;
  }, [children]);

  return (
    <group scale={[0.1 * size, 0.1 * size, 0.1]} position={[-(new Vector3()).x / 2, 0, 0]}>
      <mesh ref={mesh}>
        <textGeometry attach="geometry" args={[children, config]} />
        <meshNormalMaterial attach="material" />
      </mesh>
    </group>
  );
};
