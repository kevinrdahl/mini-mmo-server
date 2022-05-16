import { PlainObject } from "../Util/Interfaces"

var nextId = 1

export default class Character {
    id:number
    name:string

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