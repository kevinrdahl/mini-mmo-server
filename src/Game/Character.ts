import { PlainObject } from "../Util/Interfaces"
import Room from "./Room"
import World from "./World"

var nextId = 1

export default class Character {
    id:number
    name:string
    world?:World
    room?:Room

    constructor() {
        this.id = nextId++
        this.name = `Character ${this.id}`;
    }

    describe():PlainObject {
        return {
            id:this.id,
            name:this.name
        }
    }
}