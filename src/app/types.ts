import * as THREE from 'three';

export type Lego = {
    id: number,
    position: THREE.Vector3;
    color: string;
}

type Base = {
    position: THREE.Vector3;
    color: string;
}