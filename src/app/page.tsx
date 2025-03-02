'use client'
import { EffectComposer, DepthOfField, ToneMapping, Bloom } from '@react-three/postprocessing'
import { Environment, CameraControls, SoftShadows } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import { N8AO } from '@react-three/postprocessing'
import { useGrid2D, useGrid3D } from './utils'
import { Canvas } from '@react-three/fiber'
import { Base, Brick, Plane } from './ui'
import { Lego } from './types'

const x = 10; // number of layers
const y = 10; // number of rows
const z = 10; // number of columns

const initial: Lego[] = [
  new Lego(1, [0, 0, 0], "#4285f4"),
  new Lego(2, [1, 0, 0], "#db4437"),
  new Lego(3, [0, 1, 0], "#f4b400"),
  new Lego(4, [1, 1, 0], "#0f9d58")
]

const useBoard = () => {
  const legos = useGrid3D(10, 10, 10);
  const base = useGrid2D(10, 10)
  const [selected, setSelected] = useState<Lego | undefined>();

  useEffect(() => {
    // Initialise the base
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const lego = new Lego(
          ((x * 73856093) ^ (y * 19349663)) >>> 0,
          [x, y, 0] as [number, number, number],
          "#f1AC4B"
        )
        base.updateGrid(x, y, lego)
      }
    }

    initial.forEach(lego => {
      const [x, y, z] = lego.position;
      legos.updateGrid(x, y, z, lego)
    })
  }, [])


  const moveSelectedLego = (dx: number, dy: number) => {
    if (selected == null) return
    const [x, y, z] = selected.position
    let z_position = 0
    while (legos.grid.current[x + dx][y + dy][z_position]) {
      z_position++;
      if (z_position > 10) return;
    }

    // Move lego
    const updated = new Lego(selected.id, [x + dx, y + dy, z_position] as [number, number, number], selected.color);
    legos.updateGrid(x, y, z, null)
    legos.updateGrid(updated.position[0], updated.position[1], updated.position[2], updated)

    setSelected(updated)
  }
  useEffect(() => {
    console.log(selected?.position)
    base.vector.forEach((lego) => {
      if (lego.position[0] == selected?.position[0] && lego.position[1] == selected?.position[1]) {
        lego.color = "#fad096"
      } else {
        lego.color = "#f1AC4B"
      }
      base.updateGrid(lego.position[0], lego.position[1], lego)
    })
  }, [selected])

  const selectLego = (lego: Lego | undefined) => {
    if (lego) {
      const [x, y, z] = lego.position
      if (legos.grid.current[x][y][z + 1]) {
        // This lego can't be selected. It has a lego on top 
        return
      }
    }
    setSelected(lego)
  }

  return {
    legos,
    moveSelectedLego,
    selected,
    selectLego,
    base
  }
}


export default function Home() {
  const board = useBoard();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ': board.selectLego(undefined); break;
        case 'ArrowLeft': board.moveSelectedLego(-1, 0); break;
        case 'ArrowRight': board.moveSelectedLego(1, 0); break;
        case 'ArrowUp': board.moveSelectedLego(0, -1); break;
        case 'ArrowDown': board.moveSelectedLego(0, 1); break;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown) }
  }, [board]
  );

  return (
    <Canvas
      dpr={[1, 1.5]} gl={{ antialias: false }}
      shadows
      camera={{ position: [24, 16, 24], fov: 20 }}
      style={{ width: '100vw', height: '100vh' }}>
      <SoftShadows></SoftShadows>
      <color attach="background" args={['#F1AC4B']} />
      <directionalLight castShadow position={[-10, 8, -10]} lookAt={[0, 0, 0]} />
      <directionalLight position={[4, 17, 4]} lookAt={[0, 0, 0]} />
      <ambientLight intensity={0.6} />
      <Environment preset="apartment" />
      <Suspense>
        {board.legos.vector.map((lego: Lego, index) => (
          <Brick
            key={lego.id}
            position={lego.position}
            color={lego.color}
            isSelected={board.selected === lego}
            onLegoClick={(e) => { board.selectLego(lego); e.stopPropagation() }}
          />
        ))}
        {board.base.vector.map((lego: Lego, index) => (
          <Base
            key={index}
            position={[lego.position[0], lego.position[1]]}
            color={lego.color}
            isSelected={board.selected === lego}
            onLegoClick={(e) => { board.selectLego(undefined) }}
          />
        ))}
        <Plane />
      </Suspense>
      <CameraControls truckSpeed={0} dollySpeed={0} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      <EffectComposer enableNormalPass multisampling={8}>
        <N8AO aoRadius={0.5} intensity={1} />
        <Bloom luminanceThreshold={1} intensity={0.5} levels={9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

