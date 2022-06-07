import { PlainObject } from "../../Util/Interfaces";
import JSONUtil from "../../Util/JSONUtil";
import Request from "../Request";
import Ajv from "ajv"

const validate = new Ajv().compile({
    type: "object",
    properties: {
        username: {type: "string"},
        password: {type: "string"}
    },
    required: ["username", "password"]
})

export default class AccountCreate extends Request {
    type = "accountCreate"
    username?:string
    password?:string

    readJSON(json: PlainObject): void {
        super.readJSON(json)
        if (!validate(json)) throw validate.errors![0]
        this.username = json.username
        this.password = json.password
    }
}