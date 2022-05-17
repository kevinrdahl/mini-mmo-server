import { PlainObject } from "../../Util/Interfaces";
import JSONUtil from "../../Util/JSONUtil";
import Request from "../Request";

export default class AccountCreate extends Request {
    type = "createAccount"
    username?:string
    password?:string

    readJSON(json: PlainObject): void {
        super.readJSON(json)
        this.username = JSONUtil.getStr(json, "username")
        this.password = JSONUtil.getStr(json, "password")
    }
}