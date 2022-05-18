import Vector2 from "../Geom/Vector2";
import { PlainObject } from "../Util/Interfaces";
import Room from "./Room";

var nextId = 1

export default class GameObject {
    id:number
    position:Vector2 = new Vector2()
    movement:Vector2 = new Vector2()
    facing:number = 0

    constructor(public room:Room) {
        this.id = nextId++
    }

    describe():PlainObject {
        let desc:PlainObject = {
            position: this.position,
            movement: this.movement,
            facing: this.facing
        }
        return desc
    }
}