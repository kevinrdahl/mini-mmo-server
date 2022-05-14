import Client from "../Client";
import World from "./World";

export default class Room {
    clients:Set<Client> = new Set();

    constructor(public world:World) {
        
    }

    addClient(client:Client) {
        //TODO:L Add their character to the room.

        this.clients.add(client);
        //TODO: Send a message to the client, fully describing the room and its contents.
    }

    removeClient(client:Client) {
        //TODO: Send a message hiding the room.
        //TODO: Remove their character from the room.
        this.clients.delete(client);
    }
}