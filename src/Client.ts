import { WebSocket } from "ws";

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

    constructor(public socket:WebSocket) {
        this.id = nextId++
        this.lastActivity = Date.now()
    }

    toString():string {
        return `[Client ${this.id} (${wsStateNames[this.socket.readyState]})]`
    }
}