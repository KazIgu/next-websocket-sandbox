import { useRef, useMemo, useEffect } from 'react';
import {
  extend, useThree, useFrame, ReactThreeFiber,
} from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { Vector2 } from 'three';

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  UnrealBloomPass,
  FilmPass,
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'effectComposer': ReactThreeFiber.Object3DNode<EffectComposer, typeof EffectComposer>;
      'renderPass': ReactThreeFiber.Object3DNode<RenderPass, typeof RenderPass>;
      'unrealBloomPass': ReactThreeFiber.Object3DNode<UnrealBloomPass, typeof UnrealBloomPass>;
    }
  }
}

export const Effects = () => {
  const composer = useRef<EffectComposer>();
  const {
    scene, gl, size, camera,
  } = useThree();
  const aspect = useMemo(() => new Vector2(size.width, size.height), [size]);
  // eslint-disable-next-line no-void
  useEffect(() => void composer.current!.setSize(size.width, size.height), [size]);
  useFrame(() => composer.current!.render(), 1);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[aspect, 2, 1, 0]} />
    </effectComposer>
  );
};
