import Client from "../Client"
import Room from "./Room"

var nextId = 1

export default class World {
	id: number
	rooms: Map<number, Room> = new Map()
	clients: Set<Client> = new Set()

	constructor() {
		this.id = nextId++

		//for (let i = 0; i < 5; i++) {
		let room = new Room(this)
		this.rooms.set(room.id, room)
		//}
	}

	toString(): string {
		return `[World ${this.id}]`
	}

	update(delta: number) {
		for (const room of this.rooms.values()) room.update(delta)
	}

	addClient(client: Client) {
		if (this.clients.has(client)) return
		this.clients.add(client)
		client.world = this
		client.send({
			type: "setWorld",
			worldId: this.id
		})

		console.log(`${this} client added: ${client}`)
	}

	removeClient(client: Client) {
		if (this.clients.has(client)) {
			if (client.room) client.room.removeClient(client)
			this.clients.delete(client)
			client.world = undefined

			if (client.isConnected) {
				client.send({
					type: "setWorld",
					worldId: 0
				})
			}

			console.log(`${this} client removed: ${client}`)
		}
	}
}
