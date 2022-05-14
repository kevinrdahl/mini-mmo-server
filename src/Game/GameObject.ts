import Vector2 from "../Geom/Vector2";
import { PlainObject } from "../Util/Interfaces";
import Character from "./Character";
import Room from "./Room";

var nextId = 1

export default class GameObject {
    id:number
    position:Vector2 = new Vector2()
    movement:Vector2 = new Vector2()
    character?:Character

    constructor(public room:Room) {
        this.id = nextId++
    }

    describe():PlainObject {
        let desc:PlainObject = {
            position: this.position,
            movement: this.movement
        }
        if (this.character) desc["character"] = this.character
        return desc
    }
}