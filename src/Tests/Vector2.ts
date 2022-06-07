import {expect} from "chai"
import Vector2 from "../Geom/Vector2"

describe("Vector2", () => {
    function roughEqual(x:number, y:number) {
        return Math.abs(x-y) < 0.004
    }

    const vectors:Vector2[] = []

    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
            vectors.push(new Vector2(x, y))
        }
    }

    for (const vec of vectors) {
        it(`normalizes ${vec.toString()}`, () => {
            const norm = vec.normalized()
            expect(roughEqual(1.0, norm.length())).true
        })
    }
})
