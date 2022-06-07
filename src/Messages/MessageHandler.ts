import Client from "../Client"
import {PlainObject} from "../Util/Interfaces"
import JSONUtil from "../Util/JSONUtil"
import {arrayRemove} from "../Util/Utils"
import Message from "./Message"
import Request from "./Request"

export default class MessageHandler {
	private registeredTypes = new Map<string, [any, any[]]>()
	private clientRequestQueues = new WeakMap<Client, Request[]>()

	register<T extends Message>(msgType: new () => T, handler?: (msg: T, fromClient: Client) => Promise<boolean>) {
		const tmp = new msgType()
		const type = tmp.type

		const existing = this.registeredTypes.get(type)
		if (existing) {
			if (handler) {
				existing[1].push(handler)
			}
		} else {
			let handlers = handler ? [handler] : []
			this.registeredTypes.set(type, [msgType, handlers])
		}
	}

	parseMessage(raw: string, fromClient: Client): Message | undefined {
		let parsed: any
		try {
			parsed = JSON.parse(raw)
		} catch (e) {
			console.log(`Unable to parse json from ${fromClient}: ${raw}`)
			return
		}

		let type: string = ""
		let json: PlainObject
		if (Array.isArray(parsed)) {
			if (parsed.length == 0) {
				console.log(`Received 0-length array from ${fromClient}`)
				return
			}
			if (typeof parsed[0] === "string") {
				type = parsed[0]
				//TODO: use numbers for common message types
			} else {
				console.log(`Invalid first arg of array from ${fromClient}: ${parsed[0]}`)
				return
			}
			json = {type: type}
		} else if (typeof parsed === "object") {
			json = parsed
			type = JSONUtil.getStr(json, "type", "")
		} else {
			console.log(`Invalid json from ${fromClient}: ${raw}`)
			return
		}

		if (this.registeredTypes.has(type)) {
			const [msgType, handlers] = this.registeredTypes.get(type)!
			const msg: Message = new msgType()

			//If sent as an array, inflate an object from it.
			//We don't need to be strict here. The resulting object will be treated as user input in readJSON.
			if (Array.isArray(parsed)) {
				if (!msg.args) {
					console.log(`Message type "${type}" from ${fromClient} doesn't handle array format`)
					if (msg instanceof Request) msg.addError("Unhandled Syntax")
				} else {
					for (let i = 0; i < msg.args.length; i++) json[msg.args[i]] = parsed[i + 1]
				}
			}

			//Get the message to populate itself. This is expected to throw errors on bad input.
			try {
				msg.readJSON(json)
			} catch (e) {
				console.log(`Error reading json from ${fromClient}: ${e}`)
				if (msg instanceof Request) {
					const errMsg = e instanceof Error ? e.message : "" + e
					msg.addError(errMsg)
				}
				return
			}
			return msg
		}
	}

	handle(msg: Message, fromClient: Client) {
		if (msg instanceof Request) {
			let queue = this.clientRequestQueues.get(fromClient)
			if (queue) {
				if (queue.length >= 10) {
					console.log(`${fromClient} has too many pending requests`)
					fromClient.send({
						id: msg.id,
						ok: false,
						errors: ["Too many pending requests"]
					})
				} else {
					queue.push(msg)
				}
				return
			} else {
				this.clientRequestQueues.set(fromClient, [msg])
			}
		}

		this.handleInternal(msg, fromClient)
	}

	handleRaw(raw: string, fromClient: Client) {
		const msg = this.parseMessage(raw, fromClient)
		if (msg) this.handle(msg, fromClient)
	}

	private async handleInternal(msg: Message, fromClient: Client) {
		//Call handlers registered to this message type.
		let handled = false
		let ok = true
		try {
			const [msgType, handlers] = this.registeredTypes.get(msg.type)!
			for (const handler of handlers) {
				handled = true
				const result: boolean = await handler(msg, fromClient)
				ok = ok && result
				if (!result) break
			}
		} catch (e) {
			console.log(`Error in message handler for type ${msg.type}: ${e}`)
			if (msg instanceof Request) {
				const errMsg = e instanceof Error ? e.message : "" + e
				msg.addError(errMsg)
			}
		}

		//Respond
		if (msg instanceof Request) {
			if (!handled) {
				msg.addError(`Unhandled message type ${msg.type}`)
			}
			msg.response.id = msg.id
			msg.response.ok = ok && handled

			fromClient.send(msg.response)
			for (let func of msg.onResponseFuncs) func()

			let queue = this.clientRequestQueues.get(fromClient)
			if (queue) {
				arrayRemove(queue, msg)
				if (queue.length == 0) {
					this.clientRequestQueues.delete(fromClient)
				} else {
					this.handleInternal(queue[0], fromClient)
				}
			}
		}
	}
}
