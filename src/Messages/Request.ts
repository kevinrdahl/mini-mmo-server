import { PlainObject } from "../Util/Interfaces";
import JSONUtil from "../Util/JSONUtil";
import Message from "./Message";

export default abstract class Request extends Message {
    id:number = 0
    response:PlainObject = {}
    onResponseFuncs:(()=>void)[] = []

    readJSON(json: PlainObject): void {
        this.id = JSONUtil.getInt(json, "id")
    }

    /**
     * 
     * @param msg 
     * @returns false (for one-liners)
     */
    addError(msg:string) {
        if (this.response.errors === undefined) this.response.errors = [msg]
        else this.response.errors.push(msg)
        return false
    }

    /**
     * Registers a function to be called after the response to this request is sent.
     * Use this to ensure that other messages resulting from the request arrive in a logical order.
     * @param func 
     */
    onResponse(func:()=>void) {
        this.onResponseFuncs.push(func)
    }
}