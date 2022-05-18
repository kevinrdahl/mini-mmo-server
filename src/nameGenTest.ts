import { GenerateName } from "./Util/NameGen";

GenerateName()

console.time("names")
for (let i = 0; i < 25; i++) {
    const name = GenerateName()
    console.log(name)
}
console.timeEnd("names")