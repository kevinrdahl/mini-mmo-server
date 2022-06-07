export default class Vector2 {
	constructor(public x = 0, public y = 0) {}

	static fromAngle(radians: number, length: number): Vector2 {
		return new Vector2(length * Math.cos(radians), length * Math.sin(radians))
	}

	add(vec: Vector2): Vector2 {
		return new Vector2(this.x + vec.x, this.y + vec.y)
	}

	sub(vec: Vector2): Vector2 {
		return new Vector2(this.x - vec.x, this.y - vec.y)
	}

	mult(num: number): Vector2 {
		return new Vector2(this.x * num, this.y * num)
	}

	length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	dist(vec: Vector2): number {
		const dx = vec.x - this.x
		const dy = vec.y - this.y

		return Math.sqrt(dx * dx + dy * dy)
	}

	angle(): number {
		return Math.atan2(this.y, this.x)
	}

	angleTo(vec: Vector2): number {
		return Math.atan2(vec.y - this.y, vec.x - this.x)
	}

	normalized(): Vector2 {
		const angle = this.angle()
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}

	offset(radians: number, distance: number): Vector2 {
		return new Vector2(this.x + Math.cos(radians) * distance, this.y + Math.sin(radians) * distance)
	}

	moveTo(vec: Vector2, distance: number): Vector2 {
		return this.offset(this.angleTo(vec), distance)
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y)
	}

	rounded(): Vector2 {
		return new Vector2(Math.round(this.x), Math.round(this.y))
	}

	toString(): string {
		return `[Vector2 (${this.x},${this.y})]`
	}

	toJSON(): {} {
		return [this.x, this.y]
	}
}
