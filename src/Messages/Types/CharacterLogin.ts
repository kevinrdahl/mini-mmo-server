import { PlainObject } from "../../Util/Interfaces";
import JSONUtil from "../../Util/JSONUtil";
import Request from "../Request";

export default class CharacterLogin extends Request {
    type = "characterLogin"
    characterId?:number

    readJSON(json: PlainObject): void {
        this.characterId = JSONUtil.getInt(json, "characterId")
    }
}