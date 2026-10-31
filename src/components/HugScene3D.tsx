"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import Character3D from './Character3D';
import { DEFAULT_CHARACTER } from '@/lib/character-state';
import { useState, useRef } from 'react';
import { Group } from 'three';

function HuggingPair() {
  const leftRef = useRef<Group>(null);
  const rightRef = useRef<Group>(null);
  const [hugActive, setHugActive] = useState(false);

  useFrame((_, delta) => {
    if (leftRef.current && rightRef.current) {
      leftRef.current.rotation.y += delta * 0.3;
      rightRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <group ref={leftRef} position={[-0.7, 1.4, 0]} rotation={[0, 0.5, 0]}>
        <Character3D character={DEFAULT_CHARACTER} />
      </group>
      <group ref={rightRef} position={[0.7, 1.4, 0]} rotation={[0, -0.5, 0]}>
        <Character3D character={{ ...DEFAULT_CHARACTER, hairColor: '#8b4513', outfitColor: '#6a5a8a', accessory: 'bow' }} />
      </group>
    </>
  );
}

export default function HugScene3D() {
  return (
    <div style={{ width: '100%', height: '520px', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(212,106,106,0.15)', background: '#fff5eb' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={45} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.5} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ffe4c4" />
        <Environment preset="sunset" background={false} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#f8e8d0" roughness={1} metalness={0.1} />
        </mesh>

        <ContactShadows opacity={0.6} scale={20} blur={2} />
        <HuggingPair />
      </Canvas>
    </div>
  );
}
