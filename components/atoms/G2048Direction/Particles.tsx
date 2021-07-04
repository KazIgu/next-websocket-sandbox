import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Material, Object3D } from 'three';

export const Particles = ({ count }: {count: number}) => {
  const mesh = useRef<JSX.IntrinsicElements['instancedMesh']>();
  const light = useRef();

  const dummy = useMemo(() => new Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i += 1) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({
        t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0,
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { t } = particle;
      const {
        factor, speed, xFactor, yFactor, zFactor,
      } = particle;

      // eslint-disable-next-line no-multi-assign, no-param-reassign
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      // eslint-disable-next-line no-param-reassign
      particle.mx += (-particle.mx) * 0.01;
      // eslint-disable-next-line no-param-reassign
      particle.my += (-particle.my) * 0.01;

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor)
          + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor)
          + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor)
          + (Math.sin(t * 3) * factor) / 10,
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      mesh.current!.setMatrixAt!(i, dummy.matrix);
    });
    mesh.current!.instanceMatrix!.needsUpdate = true;
  });
  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
      <instancedMesh ref={mesh} args={[{} as BufferGeometry, {} as Material, count]}>
        <dodecahedronBufferGeometry attach="geometry" args={[0.2, 0]} />
        <meshPhongMaterial attach="material" color="#050505" />
      </instancedMesh>
    </>
  );
};
