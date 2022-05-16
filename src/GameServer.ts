import config from "config";
import { WebSocket, WebSocketServer } from "ws";
import Client from "./Client";
import World from "./Game/World";
import MessageHandler from "./Messages/MessageHandler";
import PingMessage from "./Messages/PingMessage";
import Updater from "./Util/Updater";

export default class GameServer {
    ws:WebSocketServer
    clients:Set<Client> = new Set()
    messages:MessageHandler = new MessageHandler()
    world:World = new World()
    updater:Updater = new Updater()

    constructor() {
        this.initMessageTypes()

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
                console.log(`${client} RECV ${msg}`)
                this.messages.handle(msg, client)
            })
        })

        this.updater.start(1/15, (delta) => {
            this.world.update(delta)
        })
    }

    initMessageTypes() {
        this.messages.register(PingMessage, (ping) => {
            console.log(`${ping.fromClient} PING!`)
            ping.response.ok = 1
        })
    }
}