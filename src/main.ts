import config from "config";
import { WebSocket } from "ws";
import GameServer from "./GameServer";

const port:number = config.get("ws.port");

const server = new GameServer();