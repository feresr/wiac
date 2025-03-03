/* eslint-disable @typescript-eslint/no-unused-vars */

import { RoundedBox } from "@react-three/drei";
import { ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";


export const Base = ({ onLegoClick, isSelected, position, color }: { onLegoClick: (e: ThreeEvent<MouseEvent>) => void, isSelected: boolean, position: [number, number], color: string }) => {

    const elevation = useMemo(() => Math.random() * 0.030, []);
    const currentPosition = useRef(new THREE.Vector3()); // Store the animated position
    const ref = useRef<THREE.Mesh>(null)

    const targetPosition = useMemo(() => {
        return new THREE.Vector3(position[0] - 5 + 0.5, elevation, position[1] - 5 + 0.5);
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

    const [n, r] = useLoader(THREE.TextureLoader, ['/normal.png', '/roughness.png'])
    const normalMap = useMemo(() => n.clone(), [n]);
    const roughnessMap = useMemo(() => r.clone(), [r]);


    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping // Repeat texture
    roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping // Repeat texture
    normalMap.repeat.set(0.03, 0.03)
    roughnessMap.repeat.set(0.03, 0.03)

    const random = useMemo(() => Math.random() * 25, [])
    normalMap.offset.set(random, random)
    normalMap.rotation = random
    roughnessMap.offset.set(random, random)
    roughnessMap.rotation = random

    return (
        <RoundedBox
            onClick={(e) => {
                onLegoClick(e)
            }}
            ref={ref}
            position={currentPosition.current}
            receiveShadow castShadow args={[1, 1, 1]} radius={0.03} smoothness={5} >
            {/* <boxGeometry args={[1, 1, 1]} /> */}
            <meshPhysicalMaterial
                color={color}
                // normalMap={normalMap} // Adds scratches
                // roughnessMap={roughnessMap} // Simulates greasy & worn areas
                clearcoatRoughnessMap={roughnessMap}
                sheenRoughnessMap={roughnessMap}

                roughness={1.0} // Low roughness for a glossy, greasy look
                metalness={0} // Plastic isn't metallic
                transmission={0.0} // Slight translucency for worn plastic
                thickness={0.5} // Affects transmission depth
                clearcoat={0.1} // Adds a shiny, greasy top layer
                clearcoatRoughness={0.99} // Slight imperfections in the gloss
                ior={1.5} // Index of refraction for plastic-like light bending
                envMapIntensity={0.5} // Boosts reflections for that greasy shine
            />
        </RoundedBox>
    )
}

export const Brick = ({ onLegoClick, isSelected, position, color }: { onLegoClick: (e: ThreeEvent<MouseEvent>) => void, isSelected: boolean, position: [number, number, number], color: string }) => {
    const currentPosition = useRef(new THREE.Vector3()); // Store the animated position
    const ref = useRef<THREE.Mesh>(null)

    const targetPosition = useMemo(() => {
        return new THREE.Vector3(position[0] - 5 + 0.5, position[2] + (isSelected ? 2.0 : 1.0), position[1] - 5 + 0.5);
    }, [position, isSelected]);


    useFrame((state) => {
        if (ref.current) {
            // currentPosition.current.lerp(targetPosition, 0.2); // Interpolate smoothly
            currentPosition.current.x = THREE.MathUtils.lerp(ref.current.position.x, targetPosition.x, 0.1);
            currentPosition.current.z = THREE.MathUtils.lerp(ref.current.position.z, targetPosition.z, 0.1);
            currentPosition.current.y = THREE.MathUtils.lerp(ref.current.position.y, targetPosition.y, 0.1);
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

    const [n, r] = useLoader(THREE.TextureLoader, ['/normal.png', '/roughness.png'])
    const normalMap = useMemo(() => n.clone(), [n]);
    const roughnessMap = useMemo(() => r.clone(), [r]);


    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping // Repeat texture
    roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping // Repeat texture
    normalMap.repeat.set(0.03, 0.03)
    roughnessMap.repeat.set(0.03, 0.03)

    const random = useMemo(() => Math.random() * 25, [])
    normalMap.offset.set(random, random)
    normalMap.rotation = random
    roughnessMap.offset.set(random, random)
    roughnessMap.rotation = random

    return (
        <RoundedBox
            onClick={(e) => {
                onLegoClick(e)
            }}
            ref={ref}
            position={currentPosition.current}
            receiveShadow castShadow args={[1, 1, 1]} radius={0.03} smoothness={5} >
            {/* <boxGeometry args={[1, 1, 1]} /> */}
            <meshPhysicalMaterial
                color={color}
                // normalMap={normalMap} // Adds scratches
                // roughnessMap={roughnessMap} // Simulates greasy & worn areas
                clearcoatRoughnessMap={roughnessMap}
                sheenRoughnessMap={roughnessMap}

                roughness={1.0} // Low roughness for a glossy, greasy look
                metalness={0} // Plastic isn't metallic
                transmission={0.0} // Slight translucency for worn plastic
                thickness={0.5} // Affects transmission depth
                clearcoat={0.1} // Adds a shiny, greasy top layer
                clearcoatRoughness={0.99} // Slight imperfections in the gloss
                ior={1.5} // Index of refraction for plastic-like light bending
                envMapIntensity={0.5} // Boosts reflections for that greasy shine
            />
        </RoundedBox>
    )
}

export const Plane = () => {
    return (
        <mesh
            position={[0, -0.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshPhysicalMaterial color={"#ffc05c"}
                roughness={1.0} // Low roughness for a glossy, greasy look
                metalness={0} // Plastic isn't metallic
                transmission={0.2} // Slight translucency for worn plastic
                thickness={1.0} // Affects transmission depth
                clearcoat={0.50} // Adds a shiny, greasy top layer
                clearcoatRoughness={0.40} // Slight imperfections in the gloss
                ior={1} // Index of refraction for plastic-like light bending
                envMapIntensity={1.5} // Boosts reflections for that greasy shine
            />
        </mesh>
    )
}