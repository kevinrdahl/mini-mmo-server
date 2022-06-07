import { PlainObject } from "../../Util/Interfaces";
import JSONUtil from "../../Util/JSONUtil";
import Request from "../Request";
import Ajv from "ajv"

const validate = new Ajv().compile({
    type: "object",
    properties: {
        username: {type: "string"},
        password: {type: "string"},
        worldId: {type: "integer"}
    },
    required: ["username", "password", "worldId"]
})

export default class AccountLogin extends Request {
    type = "accountLogin"
    username?:string
    password?:string
    worldId?:number

    readJSON(json: PlainObject): void {
        super.readJSON(json)
        if (!validate(json)) throw validate.errors![0]
        this.username = json.username
        this.password = json.password
        this.worldId = json.worldId
    }
}