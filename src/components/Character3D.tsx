import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Character } from '@/types';

export default function Character3D({ character }: { character: Character }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={character.skinColor} roughness={0.8} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 2.6, 0]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshStandardMaterial color={character.hairColor} roughness={0.6} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 1.4, 16]} />
        <meshStandardMaterial color={character.outfitColor} roughness={0.5} />
      </mesh>
    </group>
  );
}
