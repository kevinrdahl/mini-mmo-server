const fs = require("fs")

const stream = fs.createReadStream("nam_dict.txt")
let buffer = ""

const names = []
let numLines = 0
let numSigLines = 0

stream.on("data", (chunk) => {
    const lines = (buffer + chunk).split(/\r?\n/g)
    buffer = lines.pop()

    for (const line of lines) {
        numLines += 1

        if (line.startsWith("#")) continue

        numSigLines += 1
        const cols = line.split(" ").map(part => part.trim()).filter(part => part.length > 0).slice(0, 2)

        if (cols.length < 2) continue

        const rawName = cols[1].replace("+", "-").toLowerCase()
        if (rawName.includes("<") || rawName.includes("�")) continue

        names.push(rawName)
        //console.log(rawName)
    }
})

const markovLength = 3

stream.on("close", () => {
    console.log(`Read ${names.length} names from ${numLines} lines`)
    const following = {}

    for (const name of names) {
        for (let i = 0; i <= name.length; i++) {
            const char = (i == name.length) ? "$" : name.charAt(i)

            //Get up to 2 preceding characters
            const start = Math.max(0, i-markovLength)
            const end = Math.min(start+markovLength, i)
            const preceding = name.substring(start, end)

            if (!following[preceding]) following[preceding] = {}
            following[preceding][char] = true
        }
    }

    for (let preceding in following) {
        following[preceding] = Object.keys(following[preceding])
    }

    //for (let i = 0; i < 15; i++) console.log(generateName(following))
    fs.writeFileSync("following.json", JSON.stringify(following))
})

//const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
const vowels = "aeiouy".split("")

function generateName(followingChars) {
    let addCharChance = 1.3
    let name = ""
    let canEnd = false
    while (Math.random() < addCharChance || !canEnd) {
        const start = Math.max(0, name.length-markovLength)
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