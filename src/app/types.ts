/* eslint-disable @typescript-eslint/no-unused-vars */

export class Lego {
    public id: number
    public position: [number, number, number]
    public color: string

    constructor(
        id: number,
        // int type
        position: [number, number, number],
        color: string) {
        this.id = id
        this.position = position
        this.color = color
    }

    hash(): number {
        const [x, y, z] = this.position;
        let hash = 17; // Starting with a prime number to avoid patterns
        hash = (hash * 31 + this.id) & 0xFFFFFFFF; // Incorporate `id` (number)
        hash = (hash * 31 + x) & 0xFFFFFFFF; // Incorporate x
        hash = (hash * 31 + y) & 0xFFFFFFFF; // Incorporate y
        hash = (hash * 31 + z) & 0xFFFFFFFF; // Incorporate z
        for (let i = 0; i < this.color.length; i++) {
            hash = (hash * 31 + this.color.charCodeAt(i)) & 0xFFFFFFFF; // Incorporate `color` (string)
        }
        return hash
    }
}

type Base = {
    id : number
    position: [number, number];
    color: string;
}