import * as fs from "fs"

let followingChars: {[key: string]: string[]} | undefined = undefined

function getFollowing(): {[key: string]: string[]} {
	if (!followingChars) {
		followingChars = JSON.parse(fs.readFileSync("names/following.json").toString())
	}
	return followingChars!
}

const markovLength = 3
const vowels = ["a", "e", "i", "o", "u", "y"]

export function GenerateName(): string {
	const followingChars = getFollowing()
	let addCharChance = 1.3
	let name = ""
	let canEnd = false
	while (Math.random() < addCharChance || !canEnd) {
		const start = Math.max(0, name.length - markovLength)
		const end = name.length
		const preceding = name.substring(start, end)
		let pickFrom = followingChars[preceding] || vowels
		if (pickFrom.length == 1 && pickFrom[0] == "$") pickFrom = vowels

		const char = pickFrom[Math.floor(Math.random() * pickFrom.length)]
		if (char == "$") {
			if (Math.random() > addCharChance) break
			continue
		}

		name += char
		addCharChance -= 0.1

		canEnd = pickFrom.indexOf("$") != -1
	}
	return name.charAt(0).toUpperCase() + name.substring(1)
}
