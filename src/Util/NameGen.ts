const vowels = "aeiou".split("")
const consonants = "bcdfghjklmnpqrstvwxyz".split("")
const alphabet = vowels.concat(consonants)

const vowelSet:Set<string> = new Set()
for (const char of vowels) vowelSet.add(char)

type LetterLists = {[key:string]:string[]}

const validFollowingConsonants:LetterLists = {
    b:"rlby".split(""),
    c:"rlhtk".split(""),
    d:"rdy".split(""),
    f:"rfy".split(""),
    g:"rgy".split(""),
    h:[],
    j:[],
    k:"rlky".split(""),
    //"l":"" anything?
    m:[],
    n:"cdgjknstzy".split(""),
    p:"rlpy".split(""),
    q:[],
    //"r":""anything?
    s:"cghkpqsty".split(""),
    t:"rlty".split(""),
    v:"rly".split(""),
    w:[],
    x:[],
    //"y":"", anything?
    z:"z".split("")
}

const validFollowingVowels:LetterLists = {
    "q": "u".split(""),
    "a": "eiou".split(""),
    "i": "aeou".split(""),
    "u": "aeio".split("")
}

const letterFrequency:{[key:string]:number} = {
    "a": 8,
    "b": 2,
    "c": 3,
    "d": 4,
    "e": 12,
    "f": 2,
    "g": 2,
    "h": 6,
    "i": 7,
    "j": 1,
    "k": 1,
    "l": 4,
    "m": 2,
    "n": 6,
    "o": 7,
    "p": 2,
    "q": 1,
    "r": 6,
    "s": 6,
    "t": 9,
    "u": 3,
    "v": 1,
    "w": 2,
    "x": 1,
    "y": 2,
    "z": 1
}

for (const key in letterFrequency) letterFrequency[key] = 1

function randomFromList(list:string[]):string {
    let totalFrequency = 0
    for (const letter of list) totalFrequency += letterFrequency[letter]
    let rand = Math.ceil(Math.random() * list.length)
    for (const letter of list) {
        rand -= letterFrequency[letter]
        if (rand <= 0) return letter
    }
    return list[list.length-1]
}

export function GenerateName():string {
    let name:string[] = []
    let addCharChance = 1.3
    let lastChar:string|undefined
    let beforeLastChar:string|undefined

    while (Math.random() < addCharChance) {
        let selectFrom:string[] = alphabet

        if (lastChar) {
            const validVowels = validFollowingVowels[lastChar] || vowels
            const validConsonants = validFollowingConsonants[lastChar] || consonants

            let vowelOK = true
            let consonantOK = true

            if (beforeLastChar) {
                const lastWasVowel = vowelSet.has(lastChar)
                const beforeLastWasVowel = vowelSet.has(beforeLastChar)
                if (lastWasVowel && beforeLastWasVowel) {
                    vowelOK = false
                    selectFrom = validConsonants
                } else if (!lastWasVowel && !beforeLastWasVowel) {
                    consonantOK = false
                    selectFrom = validVowels
                }
            }

            if (vowelOK && consonantOK) selectFrom = validVowels.concat(validConsonants)
        }

        const char = randomFromList(selectFrom)
        name.push(char)
        addCharChance -= 0.1
        beforeLastChar = lastChar
        lastChar = char
    }

    return name.join("")
}