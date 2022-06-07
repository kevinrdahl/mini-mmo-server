export function pickRandom<T>(arr: T[]): T | undefined {
	if (arr.length == 0) return undefined
	return arr[Math.floor(Math.random() * arr.length)]
}

export function arrayRemove<T>(arr: T[], value: T): boolean {
	const index = arr.indexOf(value)
	if (index !== -1) {
		arr.splice(index, 1)
		return true
	}
	return false
}

export function roundTo(num:number, places:number = 0) {
	const factor = Math.pow(10, places)
	return Math.round((num + Number.EPSILON) * factor) / factor
}