"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Client_1 = __importDefault(require("../src/Client"));
const MessageHandler_1 = __importDefault(require("../src/Messages/MessageHandler"));
const Request_1 = __importDefault(require("../src/Messages/Request"));
const AccountCreate_1 = __importDefault(require("../src/Messages/Types/AccountCreate"));
describe("Message Handling", () => {
    it("Parse JSON Object", () => {
        const handler = new MessageHandler_1.default();
        handler.register(AccountCreate_1.default);
        const client = new Client_1.default();
        const raw = JSON.stringify({
            id: 5,
            type: "accountCreate",
            username: "Kevin",
            password: "abc"
        });
        const msg = handler.parseMessage(raw, client);
        (0, chai_1.expect)(msg).to.be.instanceOf(AccountCreate_1.default);
        if (msg instanceof AccountCreate_1.default) {
            (0, chai_1.expect)(msg.username).to.equal("Kevin");
            (0, chai_1.expect)(msg.password).to.equal("abc");
            (0, chai_1.expect)(msg.id).to.equal(5);
        }
    });
    it("Requests are handled in arrival order", (done) => {
        class DelayRequest extends Request_1.default {
            constructor() {
                super(...arguments);
                this.type = "delay";
            }
            readJSON(json) {
                super.readJSON(json);
                this.delay = json.delay;
            }
        }
        function PromiseWait(delay) {
            return new Promise((accept, reject) => {
                setTimeout(accept, delay);
            });
        }
        const handler = new MessageHandler_1.default();
        const client = new Client_1.default();
        const delays = [500, 250, 50];
        const completed = [];
        handler.register(DelayRequest, async (msg, fromClient) => {
            console.log(`Delay ${msg.delay} ms`);
            await PromiseWait(msg.delay);
            completed.push(msg.id);
            if (completed.length == delays.length) {
                try {
                    (0, chai_1.expect)(completed).to.deep.equal([1, 2, 3]);
                    done();
                }
                catch (e) {
                    done(e);
                }
            }
            return true;
        });
        delays.forEach((delay, i) => {
            const raw = JSON.stringify({ id: i + 1, type: "delay", delay: delay });
            handler.handleRaw(raw, client);
        });
    }).timeout(5000);
});
