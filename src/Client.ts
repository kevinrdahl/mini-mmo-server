import { WebSocket } from "ws";
import Room from "./Game/Room";
import World from "./Game/World";
import Account from "./Models/Account";
import Character from "./Models/Character";

const wsStateNames = {
    "0":"CONNECTING",
    "1":"OPEN",
    "2":"CLOSING",
    "3":"CLOSED"
}

let nextId = 1;

export default class Client {
    id:number
    lastActivity:number
    account?:Account
    character?:Character
    world?:World
    room?:Room

    get isConnected():boolean { return this.socket.readyState === WebSocket.OPEN }

    constructor(private socket:WebSocket) {
        this.id = nextId++
        this.lastActivity = Date.now()
    }

    send(msg:string|object) {
        if (!this.isConnected) {
            console.log(`Attempting to send a message to non-open socket ${this}`)
            return
        }

        const str = (typeof msg === "string") ? msg : JSON.stringify(msg)
        console.log(`${this} SEND ${str}`)
        this.socket.send(str)
    }

    toString():string {
        const parts = [`Client ${this.id} (${wsStateNames[this.socket.readyState]})`]
        if (this.account) parts.push(`"${this.account.username}"`)
        return `[${parts.join(" ")}]`
    }
}