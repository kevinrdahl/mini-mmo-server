import Request from "./Request";

export default class PingMessage extends Request {
    type: string = "ping"
}