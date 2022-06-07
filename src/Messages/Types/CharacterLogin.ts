import { PlainObject } from "../../Util/Interfaces";
import JSONUtil from "../../Util/JSONUtil";
import Request from "../Request";
import Ajv from "ajv"

const validate = new Ajv().compile({
    type: "object",
    properties: {
        characterId: {type: "integer"}
    },
    required: ["characterId"]
})

export default class CharacterLogin extends Request {
    type = "characterLogin"
    characterId?:number

    readJSON(json: PlainObject): void {
        super.readJSON(json)
        if (!validate(json)) throw validate.errors![0]
        this.characterId = json.characterId
    }
}