import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

function Model() {
  const group = useRef();
  const { scene, animations } = useGLTF('/high_rise_building.glb');
  const { actions } = useAnimations(animations, group);


  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0040; 
    }
  });

  useEffect(() => {
    Object.values(actions).forEach(action => {
      if (action) action.play();
    });
  }, [actions]);

  return (
    <primitive
      ref={group}
      object={scene}
      scale={[0.3, 0.3, 0.3]} 
      position={[1, -16, 0]}   
    />
  );
}

export default function ModelViewer() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [10, 10, 20], fov: 60 }} // Set camera position and FOV
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <pointLight position={[0, 5, 10]} intensity={3} />
      <Model />
    </Canvas>
  );
}
