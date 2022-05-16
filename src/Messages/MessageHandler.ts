import Client from "../Client";
import { PlainObject } from "../Util/Interfaces";
import JSONUtil from "../Util/JSONUtil";
import Message from "./Message";
import Request from "./Request";

export default class MessageHandler {
    private registeredTypes = new Map<string, [any, any[]]>()

    register<T extends Message>(msgType: (new()=>T), handler?:(msg:T)=>void) {
        const tmp = new msgType()
        const type = tmp.type
        
        const existing = this.registeredTypes.get(type)
        if (existing !== undefined ) {
            if (handler) {
                existing[1].push(handler)
            }
        } else {
            let handlers = handler ? [handler] : [];
            this.registeredTypes.set(type, [msgType, handlers])
        }
    }

    handle(raw:string, fromClient:Client) {
        let parsed:any
        try {
            parsed = JSON.parse(raw)
        } catch (e) {
            console.log(`Unable to parse json from ${fromClient}: ${raw}`)
            return
        }

        let type:string = ""
        let json:PlainObject
        if (Array.isArray(parsed)) {
            if (parsed.length == 0) {
                console.log(`Received 0-length array from ${fromClient}`)
                return
            }
            if (typeof parsed[0] === "string") {
                type = parsed[0]
                //TODO: use numbers for common message types
            } else {
                console.log(`Invalid first arg of array from ${fromClient}: ${parsed[0]}`)
                return
            }
            json = {type:type}
        } else if (typeof parsed === "object") {
            json = parsed
            type = JSONUtil.GetStr(json, "type", "")
        } else {
            console.log(`Invalid json from ${fromClient}: ${raw}`)
            return
        }

        const pair = this.registeredTypes.get(type)
        if (pair !== undefined) {
            const [msgType, handlers] = pair
            const msg:Message = msgType()
            msg.fromClient = fromClient

            //If sent as an array, inflate an object from it.
            //We don't need to be strict here. The resulting object will be treated as user input in readJSON.
            if (Array.isArray(parsed)) {
                if (!msg.args) {
                    console.log(`Message type "${type}" from ${fromClient} doesn't handle array format`)
                    if (msg instanceof Request) msg.addError("Unhandled Syntax")
                } else {
                    for (let i = 0; i < msg.args.length; i++) json[msg.args[i]] = parsed[i+1]
                }
            }

            //Get the message to populate itself. This is expected to throw errors on bad input.
            try {
                msg.readJSON(json)
            } catch (e) {
                console.log(`Error reading json from ${fromClient}: ${e}`)
                if (msg instanceof Request) {
                    const errMsg = (e instanceof Error) ? e.message : ""+e
                    msg.addError(errMsg)
                }
                return
            }

            //Call handlers registered to this message type.
            let handled = false
            try {
                for (const handler of handlers) {
                    handler(msg)
                    handled = true
                }
            } catch (e) {
                console.log(`Error in message handler for type ${type}: ${e}`)
                if (msg instanceof Request) {
                    const errMsg = (e instanceof Error) ? e.message : ""+e
                    msg.addError(errMsg)
                }
            }

            //Respond
            if (msg instanceof Request) {
                if (!handled) {
                    msg.addError(`Unhandled message type ${type}`)
                }
                msg.response.id = msg.id
                fromClient.send(msg.response)
            }
        }
    }
}