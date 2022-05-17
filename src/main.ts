import config from "config";
import { WebSocket } from "ws";
import { DB } from "./DB";
import GameServer from "./GameServer";

const port:number = config.get("ws.port")
const db = DB
console.log("Syncing DB...")

db.sync().then((db) => {
    console.log("\nDone!\n")
    const server = new GameServer(db)
})