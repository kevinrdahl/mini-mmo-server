import { PlainObject } from "./Interfaces";

export default abstract class JSONUtil {
    static GetInt(json:PlainObject, key:string, defaultValue?:number):number {
        let value = json[key]
        if (value !== undefined) {
            switch (typeof value) {
                case "string":
                    const parsed = parseInt(value)
                    if (!isNaN(parsed)) return parsed
                case "number":
                    return Math.floor(value as number)
            }
            throw new Error(`Int key "${key}" has invalid value: ${value}`)
        } else if (defaultValue !== undefined) {
            return defaultValue
        } else {
            throw new Error(`Int key "${key}" not found`);
        }
    }

    static GetStr(json:PlainObject, key:string, defaultValue?:string):string {
        let value = json[key]
        if (value === undefined) throw new Error(`String key "${key}" not found`);
        if (typeof value === "string") return value
        return value.toString()
    }
}