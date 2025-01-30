import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

function Model() {
  const group = useRef();
  const { scene, animations } = useGLTF('/viking_house.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions).forEach(action => {
      if (action) action.play();
    });
  }, [actions]);

  return (
    <primitive
      ref={group}
      object={scene}
      scale={[1, 1, 1]} // Adjusted scale for better fit
      position={[0, -5, 0]}   // Adjusted position for proper alignment
    />
  );
}

export default function ModelViewer() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 10, 20], fov: 50 }} // Set camera position and FOV
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <pointLight position={[0, 5, 10]} intensity={3} />
      <Model />
    </Canvas>
  );
}