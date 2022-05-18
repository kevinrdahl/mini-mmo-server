export function PickRandom<T>(arr:T[]):T|undefined {
    if (arr.length == 0) return undefined
    return arr[Math.floor(Math.random() * arr.length)]
}