'use client'
import { Canvas, ThreeEvent, useFrame, useThree, Vector2, Vector3 } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, AccumulativeShadows, RandomizedLight, CameraControls, SoftShadows } from '@react-three/drei'
import { EffectComposer, DepthOfField, ToneMapping, Bloom } from '@react-three/postprocessing'
import { useDrag } from '@use-gesture/react'
import { m, motion } from "motion/react"

import * as THREE from "three";



import { N8AO } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { resourceUsage } from 'process'


function Macintosh() {
  const { scene } = useGLTF("/macintosh.glb")
  return <primitive scale={3.0} object={scene} />
}

const Plane = () => {
  return (
    <mesh
      position={[0, -0.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshPhysicalMaterial color={"white"} roughness={0.8} metalness={0.0} clearcoat={0.0} clearcoatRoughness={0.2} />
    </mesh>
  )
}

const Lego = ({ onLegoClick, isSelected, position, color }: { onLegoClick: (e: ThreeEvent<MouseEvent>) => void, isSelected: boolean, position: THREE.Vector3, color: string }) => {
  const currentPosition = useRef(new THREE.Vector3()); // Store the animated position
  const ref = useRef<THREE.Mesh>(null)

  const targetPosition = useMemo(() => {
    return new THREE.Vector3(position.x - 5 + 0.5, position.z + (isSelected ? 2.5 : 1.5), position.y - 5 + 0.5);
  }, [position, isSelected]);


  useFrame((state) => {
    if (ref.current) {
      currentPosition.current.lerp(targetPosition, 0.2); // Interpolate smoothly
      ref.current.position.copy(currentPosition.current);

      if (isSelected) {
        const t = state.clock.getElapsedTime()
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, Math.cos(t / 1) / 5 + 0.25, 0.2)
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, Math.sin(t / 2) / 7, 0.2)
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, Math.sin(t / 4) / 8, 0.2)
      } else {
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, 0.1)
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, 0.1)
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, 0.1)
      }
    }
  });

  return (
    <mesh
      ref={ref}
      position={currentPosition.current} // initial position
      castShadow
      onClick={(e) => {
        onLegoClick(e)
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial color={color} roughness={1.0} metalness={0.0} clearcoat={0.0} clearcoatRoughness={0.1} />
    </mesh>
  )
}
const Box = ({ onMouseMove }: { onMouseMove: (e: Vector2) => void }) => {
  const scale = new THREE.Vector2(10, 10)
  const invert = new THREE.Vector2(1, -1)
  const offset = new THREE.Vector2(5, 5)
  return (
    <mesh receiveShadow
      position={[0, 0.0, 0]} castShadow>
      <boxGeometry args={[10, 2, 10]} />
      <meshPhysicalMaterial color={"#f1AC4B"} roughness={0.1} metalness={0.0} clearcoat={0.8} clearcoatRoughness={0.0} />
    </mesh>
  )
}

type Lego = {
  position: THREE.Vector3;
  color: string;
}


const x = 10; // number of layers
const y = 10; // number of rows
const z = 10; // number of columns
// Initialize a 3D array of numbers
const threeDArray: number[][][] = new Array(x).fill(null).map(() =>
  new Array(y).fill(null).map(() =>
    new Array(z).fill(0) // Initialize each element to 0
  )
);

const initial: Lego[] = [
  { position: new THREE.Vector3(0, 0, 0), color: "#ff0000" },
  { position: new THREE.Vector3(1, 0, 0), color: "#00ff00" },
  { position: new THREE.Vector3(0, 1, 0), color: "#0000ff" },
  { position: new THREE.Vector3(1, 1, 0), color: "#ffff00" }
]



export default function Home() {
  const [legos, setLegos] = useState<Lego[]>(initial);
  const gridRef = useMemo(() => {
    const array: (Lego | null)[][][] = Array.from({ length: x }, () =>
      Array.from({ length: y }, () =>
        Array.from({ length: z }, () => null)
      )
    )
    legos.forEach((lego) => { array[lego.position.x][lego.position.y][lego.position.z] = lego; })
    return array
  }, [legos]);
  const [selected, setSelected] = useState<Lego | undefined>();
  const [fov, setFov] = useState(20)

  const moveSelectedLego = (dx: number, dy: number) => {
    if (selected == null) return
    const { x, y, z } = selected.position
    let z_position = 0
    console.log(x + dx)
    console.log(y + dy)
    while (gridRef[x + dx][y + dy][z_position]) {
      z_position++;
      if (z_position > 10) return;
    }

    const movedLego = { ...selected, position: new THREE.Vector3(x + dx, y + dy, z_position) }

    setLegos(legos.map(lego => lego === selected ? movedLego : lego));
    setSelected(movedLego);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
          setSelected(undefined);
          break;
        case 'ArrowLeft':
          moveSelectedLego(-1, 0);
          break;
        case 'ArrowRight':
          moveSelectedLego(1, 0);
          break;
        case 'ArrowUp':
          moveSelectedLego(0, 1);
          break;
        case 'ArrowDown':
          moveSelectedLego(0, -1);
          break;
      }

    }
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown) }
  }, [selected]
  );

  // Removed duplicate code blocks for selecting lego based on position
  return (
    <Canvas
      dpr={[1, 1.5]} gl={{ antialias: false }}
      shadows
      camera={{ position: [20, 26, 20], fov: fov }}
      style={{ width: '100vw', height: '100vh' }}>
      <SoftShadows></SoftShadows>
      {/* <fog attach="fog" color="#F1AC4B" near={10} far={60} /> */}
      <color attach="background" args={['#F1AC4B']} />


      <rectAreaLight position={[-10, 10, -15]} width={10} height={10} lookAt={[0, 0, 0]} ></rectAreaLight>
      {/* <directionalLight castShadow position={[-10, 10, -15]} /> */}
      {/* <pointLight position={[-10, 10, -10]} /> */}
      <ambientLight intensity={0.7} />

      <Environment preset="apartment" />
      {/* <Plane /> */}
      <Suspense>
        {legos.map((lego, index) => (
          <Lego
            key={index}
            position={lego.position}
            color={lego.color}
            isSelected={selected === lego}
            onLegoClick={(e) => { setSelected(lego) }}
          />
        ))}
        <Box onMouseMove={(e) => { }} />
        <Plane />
      </Suspense>
      <CameraControls truckSpeed={0} dollySpeed={0} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      {/* <AccumulativeShadows temporal frames={100} color="orange" colorBlend={2} opacity={0.7} scale={60} position={[0, 0, 0]}>
          <RandomizedLight amount={8} radius={15} ambient={0.5} intensity={1} position={[-5, 10, -5]} size={90} />
        </AccumulativeShadows> */}
      {/* <Macintosh /> */}
      <EffectComposer enableNormalPass multisampling={8}>
        <N8AO aoRadius={0.5} intensity={1} />

        <Bloom luminanceThreshold={1} intensity={0.5} levels={9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}