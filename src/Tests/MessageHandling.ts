import {expect} from "chai"
import {WebSocket} from "ws"
import Client from "../Client"
import MessageHandler from "../Messages/MessageHandler"
import Request from "../Messages/Request"
import AccountCreate from "../Messages/Types/AccountCreate"
import {PlainObject} from "../Util/Interfaces"

describe("Message Handling", () => {
	it("Parse JSON Object", () => {
		const handler = new MessageHandler()
		handler.register(AccountCreate)

		const client = new Client()

		const raw = JSON.stringify({
			id: 5,
			type: "accountCreate",
			username: "Kevin",
			password: "abc"
		})

		const msg = handler.parseMessage(raw, client)
		expect(msg).to.be.instanceOf(AccountCreate)
		if (msg instanceof AccountCreate) {
			expect(msg.username).to.equal("Kevin")
			expect(msg.password).to.equal("abc")
			expect(msg.id).to.equal(5)
		}
	})

	it("Requests are handled in arrival order", (done) => {
		class DelayRequest extends Request {
			type = "delay"
			delay?: number

			readJSON(json: PlainObject): void {
				super.readJSON(json)
				this.delay = json.delay
			}
		}

		function PromiseWait(delay: number) {
			return new Promise((accept, reject) => {
				setTimeout(accept, delay)
			})
		}

		const handler = new MessageHandler()
		const client = new Client()

		const delays: number[] = [500, 250, 50]
		const completed: number[] = []

		handler.register(DelayRequest, async (msg, fromClient) => {
			console.log(`Delay ${msg.delay} ms`)
			await PromiseWait(msg.delay!)
			completed.push(msg.id)
			if (completed.length == delays.length) {
				try {
					expect(completed).to.deep.equal([1, 2, 3])
					done()
				} catch (e) {
					done(e)
				}
			}
			return true
		})

		delays.forEach((delay, i) => {
			const raw = JSON.stringify({id: i + 1, type: "delay", delay: delay})
			handler.handleRaw(raw, client)
		})
	}).timeout(5000)
})
