import { PlainObject } from "../Util/Interfaces";
import JSONUtil from "../Util/JSONUtil";
import Message from "./Message";

export default abstract class Request extends Message {
    id:number = 0
    response:PlainObject = {}

    readJSON(json: PlainObject): void {
        this.id = JSONUtil.GetInt(json, "id")
    }

    toJSON(): PlainObject {
        return {id:this.id}
    }

    addError(msg:string) {
        if (this.response.errors === undefined) this.response.errors = [msg]
        else this.response.errors.push(msg)
    }
}