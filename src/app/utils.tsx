
import { useMemo, useRef, useState } from 'react';
import type { Lego } from './types'

const calculateHash2D = (grid: (Lego | null)[][]) => {
    return grid.flat(2).map((cell) => (cell ? 1 : 0)).join();
};


const calculateHash3D = (grid: (Lego | null)[][][]) => {
    return grid.flat(2).map((cell) => (cell ? 1 : 0)).join();
};

export const useGrid2D = (x: number, y: number) => {
    const grid = useRef<(Lego | null)[][]>(Array.from({ length: x }, () => Array.from({ length: y }, () => null)));
    const [hash, setHash] = useState(calculateHash2D(grid.current));

    const updateGrid = (x: number, y: number, value: Lego | null) => {
        grid.current[x][y] = value;
        setHash(calculateHash2D(grid.current)); // Trigger effect
    };

    const extractLegoVectors = (grid: (Lego | null)[][]): Lego[] => {
        const vectors: LegoVector[] = [];
        grid.forEach((plane, x) =>
            plane.forEach((lego, y) => {
                if (lego) vectors.push(lego)
            }
            ));
        return vectors;
    };
    const vector = useMemo(() => extractLegoVectors(grid.current), [hash]);
    return { grid, vector, updateGrid, hash };
}

export const useGrid3D = (x: number, y: number, z: number) => {
    const grid = useRef<(Lego | null)[][][]>(Array.from({ length: x }, () => Array.from({ length: y }, () => Array.from({ length: z }, () => null))));

    const extractLegoVectors = (grid: (Lego | null)[][][]): Lego[] => {
        const vectors: Lego[] = [];
        grid.forEach((plane, x) =>
            plane.forEach((row, y) =>
                row.forEach((lego, z) => {
                    if (lego) vectors.push(lego);
                })
            )
        );
        return vectors;
    };

    const [hash, setHash] = useState(calculateHash3D(grid.current));
    const updateGrid = (x: number, y: number, z: number, value: Lego | null) => {
        grid.current[x][y][z] = value;
        setHash(calculateHash3D(grid.current)); // Trigger effect
    };

    const vector = useMemo(() => extractLegoVectors(grid.current), [hash]);

    return { grid, vector, updateGrid, hash };
}