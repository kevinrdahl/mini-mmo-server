import Request from "../Request";

/**
 * May be used as a keepalive, or to check latency. Should respond with the id, and "ok" set to 1
 */
export default class Ping extends Request {
    type: string = "ping"
}