'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RubiksCube from './RubiksCube';

export default function Cube() {
  return (
    <Canvas camera={{ position: [6, 6, 6], fov: 45 }}>
      {/* Background is transparent to let CSS shine through */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} />
      
      <RubiksCube />
      
      {/* OrbitControls allows user to drag and rotate the camera around the cube */}
      <OrbitControls enablePan={false} minDistance={4} maxDistance={20} />
    </Canvas>
  );
}
