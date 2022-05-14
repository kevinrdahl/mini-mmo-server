import config from "config";
import { WebSocket, WebSocketServer } from "ws";
import Client from "./Client";

export default class GameServer {
    ws:WebSocketServer
    clients:Set<Client> = new Set()

    constructor() {
        const port:number = config.get("ws.port");
        this.ws = new WebSocketServer({port:port}, () => {
            console.log(`WebSocket listening on port ${port}`)
        });

        this.ws.on("connection", (socket) => {
            const client = new Client(socket)
            this.clients.add(client);

            console.log(`Client connected: ${client}`)
            socket.on("close", () => {
                console.log(`Client disconnected: ${client}`)
                this.clients.delete(client);
                //todo: remove them and their character from rooms
            })

            socket.on("message", (data, isBinary) => {
                const msg = data.toString()
                console.log(`Message from ${client}: ${msg}`)
                socket.send("Ok.")
            })
        })
    }
}