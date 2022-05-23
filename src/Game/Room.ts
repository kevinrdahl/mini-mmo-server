import Client from "../Client";
import GameObject from "./GameObject";
import World from "./World";

var nextId = 1

export default class Room {
    id:number
    clients:Set<Client> = new Set();
    gameObjects:Map<number, GameObject> = new Map()

    constructor(public world:World) {
        this.id = nextId++
    }

    toString():string {
        return `[Room ${this.id}]`
    }

    update(delta:number) {
        
    }

    addClient(client:Client) {
        //TODO: Add their character to the room.

        this.clients.add(client);
        client.room = this
        client.send({
            type:"setRoom",
            roomId:this.id
        })
        //TODO: Send a message to the client, fully describing the room and its contents.

        console.log(`${this} client added: ${client}`)
    }

    removeClient(client:Client) {
        //TODO: Send a message hiding the room.
        //TODO: Remove their character from the room.
        this.clients.delete(client);
        client.room = undefined

        if (client.isConnected) {
            client.send({
                type:"setRoom",
                roomId:0
            })
        }

        console.log(`${this} client removed: ${client}`)
    }
}