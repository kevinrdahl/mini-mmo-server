import { WebSocket } from "ws";
import Room from "./Game/Room";
import Unit from "./Game/Unit";
import World from "./Game/World";
import Account from "./Models/Account";
import Character from "./Models/Character";

const wsStateNames = {
    "0":"CONNECTING",
    "1":"OPEN",
    "2":"CLOSING",
    "3":"CLOSED",
    "-1":"FAKE"
}

let nextId = 1;

export default class Client {
    id:number
    lastActivity:number
    account?:Account
    character?:Character
    world?:World
    room?:Room
    unit?:Unit

    get isConnected():boolean { return this.socket?.readyState === WebSocket.OPEN }

    constructor(private socket?:WebSocket) {
        this.id = nextId++
        this.lastActivity = Date.now()
    }

    send(msg:string|object) {
        if (!this.isConnected && this.socket) {
            console.log(`Attempting to send a message to non-open socket ${this}`)
            return
        }

        const str = (typeof msg === "string") ? msg : JSON.stringify(msg)
        //console.log(`${this} SEND ${str}`)
        this.socket?.send(str)
    }

    toString():string {
        const readyState = this.socket ? this.socket.readyState : "-1"
        const parts = [`Client ${this.id} (${wsStateNames[readyState]})`]
        if (this.account) parts.push(`"${this.account.username}"`)
        if (this.world) parts.push(`World ${this.world.id}`)
        if (this.room) parts.push(`Room ${this.room.id}`)
        return `[${parts.join(" ")}]`
    }
}