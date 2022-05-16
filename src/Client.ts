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

    constructor(private socket:WebSocket) {
        this.id = nextId++
        this.lastActivity = Date.now()
    }

    send(msg:string|object) {
        const str = (typeof msg === "string") ? msg : JSON.stringify(msg)
        console.log(`${this} SEND ${str}`)
        this.socket.send(str)
    }

    toString():string {
        return `[Client ${this.id} (${wsStateNames[this.socket.readyState]})]`
    }
}