import Client from "../Client";
import { PlainObject } from "../Util/Interfaces";
import Unit from "./Unit";
import World from "./World";

var nextId = 1

export default class Room {
    id:number
    clients:Set<Client> = new Set();
    units:Map<number, Unit> = new Map()

    constructor(public world:World) {
        this.id = nextId++
    }

    toString():string {
        return `[Room ${this.id}]`
    }

    update(delta:number) {
        
    }

    addClient(client:Client) {
        this.addClientUnit(client)

        this.clients.add(client) //add after the unit, to avoid telling them about the unit twice

        client.room = this
        client.send({
            type: "setRoom",
            room: this.describe(),
            unitId: client.unit!.id,
        })

        console.log(`${this} client added: ${client}`)
    }

    removeClient(client:Client) {
        //TODO: Send a message hiding the room.
        //TODO: Remove their character from the room.
        this.clients.delete(client);
        client.room = undefined

        if (client.unit) this.removeUnit(client.unit)
        client.unit = undefined

        if (client.isConnected) {
            client.send({
                type: "setRoom" //if no room data, acts as "leave the room"
            })
        }

        console.log(`${this} client removed: ${client}`)
    }

    addUnit(unit:Unit) {
        this.units.set(unit.id, unit)
        unit.room = this

        this.broadcast({
            type: "addUnit",
            unit: unit.describe()
        })
    }

    removeUnit(unit:Unit) {
        this.units.delete(unit.id)
        unit.room = undefined
        
        this.broadcast({
            type: "removeUnit",
            unitId: unit.id
        })
    }

    addClientUnit(client:Client) {
        const unit = new Unit()
        unit.position.x = Math.random() * 500
        unit.position.y = Math.random() * 500
        unit.character = client.character
        client.unit = unit

        this.addUnit(unit)
    }

    describe():PlainObject {
        const desc:PlainObject = {
            id: this.id
        }

        const units:PlainObject[] = []
        for (let unit of this.units.values()) {
            units.push(unit.describe())
        }
        desc.units = units

        return desc
    }

    broadcast(msg:PlainObject) {
        for (let client of this.clients.values()) {
            client.send(msg)
        }
    }
}