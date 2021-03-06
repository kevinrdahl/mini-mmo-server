import Client from "../Client"
import {PlainObject} from "../Util/Interfaces"

export default abstract class Message {
	abstract type: string
	/**
	 * A list of key names. Allows a list of arguments to be sent, then used to populate a plain object.
	 * For frequent messages which ought to be more compact.
	 * NOTE: Define this statically!
	 */
	args?: string[]

	abstract readJSON(json: PlainObject): void
}
