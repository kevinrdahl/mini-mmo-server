import { PlainObject } from "../../Util/Interfaces";
import JSONUtil from "../../Util/JSONUtil";
import Request from "../Request";

export default class AccountLogin extends Request {
    type = "accountLogin"
    username?:string
    password?:string
    worldId?:number

    readJSON(json: PlainObject): void {
        super.readJSON(json)
        this.username = JSONUtil.getStr(json, "username")
        this.password = JSONUtil.getStr(json, "password")
        this.worldId = JSONUtil.getInt(json, "worldId")
    }
}