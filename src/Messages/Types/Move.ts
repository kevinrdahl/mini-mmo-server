import { PlainObject } from "../../Util/Interfaces";
import Message from "../Message";
import Ajv from "ajv"
import Vector2 from "../../Geom/Vector2";

const validate = new Ajv().compile({
    type: "object",
    properties: {
        movement:{
            type: "array",
            items: {type: "number"},
            minItems: 2,
            maxItems: 2
        }
    },
    required: ["movement"]
})

export default class Move extends Message {
    type = "move"
    movement?:Vector2


    readJSON(json: PlainObject): void {
        if (!validate(json)) throw validate.errors![0]

        this.movement = new Vector2(json.movement[0], json.movement[1])
        if (this.movement.length() > 0) this.movement = this.movement.normalized()
    }
}