export function PickRandom<T>(arr: T[]): T | undefined {
	if (arr.length == 0) return undefined
	return arr[Math.floor(Math.random() * arr.length)]
}

export function ArrayRemove<T>(arr: T[], value: T): boolean {
	const index = arr.indexOf(value)
	if (index !== -1) {
		arr.splice(index, 1)
		return true
	}
	return false
}
