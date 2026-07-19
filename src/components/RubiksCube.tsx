'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const CUBIE_SIZE = 1;
const SPACING = 0.05;
const OFFSET = CUBIE_SIZE + SPACING;

const COLORS = {
  U: '#ffffff', // Up (White)
  D: '#ffd500', // Down (Yellow)
  F: '#009e60', // Front (Green)
  B: '#0051ba', // Back (Blue)
  R: '#c41e3a', // Right (Red)
  L: '#ff5800', // Left (Orange)
  Core: '#151515' // Inner Plastic
};

type CubieData = {
  id: number;
  initX: number;
  initY: number;
  initZ: number;
};

function createTextTexture(text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 300px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 256 + 25);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

export default function RubiksCube() {
  const groupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null);
  const cubiesRef = useRef<{ [key: number]: THREE.Mesh }>({});
  
  // Animation state
  const isAnimating = useRef(false);
  const animQueue = useRef<string[]>([]);
  const currentAnim = useRef<{ axis: 'x'|'y'|'z', dir: number, target: number, progress: number, pieces: THREE.Mesh[] } | null>(null);

  // Generate 27 pieces
  const cubiesData = useMemo(() => {
    const pieces: CubieData[] = [];
    let id = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          pieces.push({ id: id++, initX: x, initY: y, initZ: z });
        }
      }
    }
    return pieces;
  }, []);

  const textureR = useMemo(() => createTextTexture('R'), []);
  const textureL = useMemo(() => createTextTexture('L'), []);
  const textureU = useMemo(() => createTextTexture('U'), []);
  const textureD = useMemo(() => createTextTexture('D'), []);
  const textureF = useMemo(() => createTextTexture('F'), []);
  const textureB = useMemo(() => createTextTexture('B'), []);

  // Listen for keyboard input to queue turns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (animQueue.current.length > 5) return; // Prevent spamming
      
      const key = e.key.toUpperCase();
      let move = '';
      
      // Standard WCA notation mapping
      if (key === 'R') move = e.shiftKey ? "R'" : "R";
      if (key === 'L') move = e.shiftKey ? "L'" : "L";
      if (key === 'U') move = e.shiftKey ? "U'" : "U";
      if (key === 'D') move = e.shiftKey ? "D'" : "D";
      if (key === 'F') move = e.shiftKey ? "F'" : "F";
      if (key === 'B') move = e.shiftKey ? "B'" : "B";
      
      if (move) animQueue.current.push(move);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for custom button events (Scramble, Solve)
  useEffect(() => {
    const handleAction = (e: Event) => {
      const action = (e as CustomEvent).detail;
      if (action === 'SCRAMBLE') {
        const moves = ['R', 'L', 'U', 'D', 'F', 'B', "R'", "L'", "U'", "D'", "F'", "B'"];
        const randomMoves = Array.from({length: 20}, () => moves[Math.floor(Math.random() * moves.length)]);
        animQueue.current.push(...randomMoves);
      } else if (action === 'SOLVE') {
        animQueue.current = [];
        isAnimating.current = false;
        currentAnim.current = null;
        Object.values(cubiesRef.current).forEach(mesh => {
          if (mesh.userData.initPos) {
            mesh.position.copy(mesh.userData.initPos);
            mesh.rotation.set(0, 0, 0);
          }
        });
      }
    };
    window.addEventListener('cube-action', handleAction);
    return () => window.removeEventListener('cube-action', handleAction);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !pivotRef.current) return;

    // Start a new turn if queue has items and we are not animating
    if (!isAnimating.current && animQueue.current.length > 0) {
      const move = animQueue.current.shift()!;
      isAnimating.current = true;
      
      let axis: 'x'|'y'|'z' = 'x';
      let dir = 1;
      let filterFn = (pos: THREE.Vector3) => true;

      // Reset the temporary pivot group
      pivotRef.current.rotation.set(0, 0, 0);
      pivotRef.current.updateMatrixWorld();

      const THRESH = 0.5;

      if (move.startsWith('R')) { axis = 'x'; dir = move.includes("'") ? 1 : -1; filterFn = p => p.x > THRESH; }
      if (move.startsWith('L')) { axis = 'x'; dir = move.includes("'") ? -1 : 1; filterFn = p => p.x < -THRESH; }
      if (move.startsWith('U')) { axis = 'y'; dir = move.includes("'") ? 1 : -1; filterFn = p => p.y > THRESH; }
      if (move.startsWith('D')) { axis = 'y'; dir = move.includes("'") ? -1 : 1; filterFn = p => p.y < -THRESH; }
      if (move.startsWith('F')) { axis = 'z'; dir = move.includes("'") ? 1 : -1; filterFn = p => p.z > THRESH; }
      if (move.startsWith('B')) { axis = 'z'; dir = move.includes("'") ? -1 : 1; filterFn = p => p.z < -THRESH; }

      const targetPieces: THREE.Mesh[] = [];
      
      // Find which of the 27 cubies belong to the face being turned
      Object.values(cubiesRef.current).forEach(mesh => {
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        if (filterFn(worldPos)) {
          targetPieces.push(mesh);
        }
      });

      // Attach target cubies to the pivot group for rotation
      targetPieces.forEach(mesh => {
        pivotRef.current!.attach(mesh);
      });

      currentAnim.current = { 
        axis, 
        dir, 
        target: (Math.PI / 2) * dir, 
        progress: 0, 
        pieces: targetPieces 
      };
    }

    // Process active animation
    if (isAnimating.current && currentAnim.current) {
      const anim = currentAnim.current;
      const speed = Math.PI * 4; // Turn speed (2 full rotations per second)
      const step = speed * delta * Math.sign(anim.dir);
      
      anim.progress += step;
      pivotRef.current.rotation[anim.axis] = anim.progress;

      // Check if turn is complete (90 degrees = Math.PI / 2)
      if (Math.abs(anim.progress) >= Math.abs(anim.target)) {
        // Snap to exact 90 degrees to prevent floating point inaccuracies
        pivotRef.current.rotation[anim.axis] = anim.target;
        pivotRef.current.updateMatrixWorld();

        // Detach from pivot and re-attach back to main group
        anim.pieces.forEach(mesh => {
          groupRef.current!.attach(mesh);
          
          // Snap positions and rotations to clean numbers
          mesh.position.x = Math.round(mesh.position.x * 100) / 100;
          mesh.position.y = Math.round(mesh.position.y * 100) / 100;
          mesh.position.z = Math.round(mesh.position.z * 100) / 100;
          
          const euler = mesh.rotation;
          mesh.rotation.set(
            Math.round(euler.x / (Math.PI/2)) * (Math.PI/2),
            Math.round(euler.y / (Math.PI/2)) * (Math.PI/2),
            Math.round(euler.z / (Math.PI/2)) * (Math.PI/2)
          );
        });

        pivotRef.current.rotation.set(0, 0, 0);
        isAnimating.current = false;
        currentAnim.current = null;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={pivotRef} />
      
      {cubiesData.map((data) => {
        const px = data.initX * OFFSET;
        const py = data.initY * OFFSET;
        const pz = data.initZ * OFFSET;

        return (
          <mesh 
            key={data.id} 
            ref={(el) => { if (el) cubiesRef.current[data.id] = el; }}
            position={[px, py, pz]}
            userData={{ initPos: new THREE.Vector3(px, py, pz) }}
          >
            {/* The Core */}
            <RoundedBox args={[0.94, 0.94, 0.94]} radius={0.05} smoothness={4}>
              <meshStandardMaterial color={COLORS.Core} roughness={0.8} metalness={0.1} />
            </RoundedBox>

            {/* Right Sticker */}
            {data.initX === 1 && (
              <group position={[0.48, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <RoundedBox args={[0.86, 0.86, 0.02]} radius={0.1} smoothness={4}>
                  <meshPhysicalMaterial color={COLORS.R} roughness={0.2} metalness={0.1} clearcoat={0.8} clearcoatRoughness={0.2} />
                </RoundedBox>
                {data.initY === 0 && data.initZ === 0 && (
                  <mesh position={[0, 0, 0.015]}>
                    <planeGeometry args={[0.6, 0.6]} />
                    <meshBasicMaterial map={textureR} transparent depthWrite={false} />
                  </mesh>
                )}
              </group>
            )}

            {/* Left Sticker */}
            {data.initX === -1 && (
              <group position={[-0.48, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <RoundedBox args={[0.86, 0.86, 0.02]} radius={0.1} smoothness={4}>
                  <meshPhysicalMaterial color={COLORS.L} roughness={0.2} metalness={0.1} clearcoat={0.8} clearcoatRoughness={0.2} />
                </RoundedBox>
                {data.initY === 0 && data.initZ === 0 && (
                  <mesh position={[0, 0, 0.015]}>
                    <planeGeometry args={[0.6, 0.6]} />
                    <meshBasicMaterial map={textureL} transparent depthWrite={false} />
                  </mesh>
                )}
              </group>
            )}

            {/* Up Sticker */}
            {data.initY === 1 && (
              <group position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <RoundedBox args={[0.86, 0.86, 0.02]} radius={0.1} smoothness={4}>
                  <meshPhysicalMaterial color={COLORS.U} roughness={0.2} metalness={0.1} clearcoat={0.8} clearcoatRoughness={0.2} />
                </RoundedBox>
                {data.initX === 0 && data.initZ === 0 && (
                  <mesh position={[0, 0, 0.015]}>
                    <planeGeometry args={[0.6, 0.6]} />
                    <meshBasicMaterial map={textureU} transparent depthWrite={false} />
                  </mesh>
                )}
              </group>
            )}

            {/* Down Sticker */}
            {data.initY === -1 && (
              <group position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <RoundedBox args={[0.86, 0.86, 0.02]} radius={0.1} smoothness={4}>
                  <meshPhysicalMaterial color={COLORS.D} roughness={0.2} metalness={0.1} clearcoat={0.8} clearcoatRoughness={0.2} />
                </RoundedBox>
                {data.initX === 0 && data.initZ === 0 && (
                  <mesh position={[0, 0, 0.015]}>
                    <planeGeometry args={[0.6, 0.6]} />
                    <meshBasicMaterial map={textureD} transparent depthWrite={false} />
                  </mesh>
                )}
              </group>
            )}

            {/* Front Sticker */}
            {data.initZ === 1 && (
              <group position={[0, 0, 0.48]} rotation={[0, 0, 0]}>
                <RoundedBox args={[0.86, 0.86, 0.02]} radius={0.1} smoothness={4}>
                  <meshPhysicalMaterial color={COLORS.F} roughness={0.2} metalness={0.1} clearcoat={0.8} clearcoatRoughness={0.2} />
                </RoundedBox>
                {data.initX === 0 && data.initY === 0 && (
                  <mesh position={[0, 0, 0.015]}>
                    <planeGeometry args={[0.6, 0.6]} />
                    <meshBasicMaterial map={textureF} transparent depthWrite={false} />
                  </mesh>
                )}
              </group>
            )}

            {/* Back Sticker */}
            {data.initZ === -1 && (
              <group position={[0, 0, -0.48]} rotation={[0, Math.PI, 0]}>
                <RoundedBox args={[0.86, 0.86, 0.02]} radius={0.1} smoothness={4}>
                  <meshPhysicalMaterial color={COLORS.B} roughness={0.2} metalness={0.1} clearcoat={0.8} clearcoatRoughness={0.2} />
                </RoundedBox>
                {data.initX === 0 && data.initY === 0 && (
                  <mesh position={[0, 0, 0.015]}>
                    <planeGeometry args={[0.6, 0.6]} />
                    <meshBasicMaterial map={textureB} transparent depthWrite={false} />
                  </mesh>
                )}
              </group>
            )}
          </mesh>
        );
      })}
    </group>
  );
}
