import config from "config";
import { Sequelize } from "sequelize/types";
import { WebSocket, WebSocketServer } from "ws";
import Client from "./Client";
import ClientManager from "./ClientManager";
import World from "./Game/World";
import MessageHandler from "./Messages/MessageHandler";
import AccountCreate from "./Messages/Types/AccountCreate";
import AccountLogin from "./Messages/Types/AccountLogin";
import Ping from "./Messages/Types/Ping";
import Account from "./Models/Account";
import Updater from "./Util/Updater";

export default class GameServer {
    ws:WebSocketServer
    clients:ClientManager
    messages:MessageHandler = new MessageHandler()
    world:World = new World()
    updater:Updater = new Updater()

    constructor(public db:Sequelize) {
        this.clients = new ClientManager(this)

        this.registerMessageHandlers()

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

    registerMessageHandlers() {
        this.clients.registerMessageHandlers()

        this.messages.register(Ping, async (msg, fromClient) => {
            console.log(`${fromClient} PING!`)
            return true
        })
    }
}