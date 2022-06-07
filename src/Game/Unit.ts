import Vector2 from "../Geom/Vector2"
import Character from "../Models/Character"
import {PlainObject} from "../Util/Interfaces"
import Room from "./Room"

var nextId = 1

export default class Unit {
	id: number
	position: Vector2 = new Vector2()
	movement: Vector2 = new Vector2()
	facing: number = 0
	room?: Room

	character?: Character

	constructor() {
		this.id = nextId++
	}

	describe(): PlainObject {
		const desc: PlainObject = {
			id: this.id,
			position: this.position.rounded(),
			movement: this.movement.rounded(),
			facing: Math.round(this.facing)
		}

		if (this.character) desc.character = this.character.describe()

		return desc
	}
}
