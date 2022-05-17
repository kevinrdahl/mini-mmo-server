import * as bcrypt from "bcrypt"
import Client from "./Client";
import GameServer from "./GameServer";
import AccountCreate from "./Messages/Types/AccountCreate";
import AccountLogin from "./Messages/Types/AccountLogin";
import Account from "./Models/Account";

export default class ClientManager {
    clients:Set<Client> = new Set()

    constructor(public server:GameServer) {

    }

    add(client:Client) {
        this.clients.add(client)
    }

    delete(client:Client) {
        this.logout(client)
        this.clients.delete(client)
    }

    registerMessageHandlers() {
        this.server.messages.register(AccountCreate, async (msg, fromClient) => {
            const existing = await Account.findOne({where:{username:msg.username}})
            if (existing) {
                return msg.addError("Username already exists.")
            }
            const hash = await bcrypt.hash(msg.password!, 10)
            const account = await Account.create({
                username:msg.username!,
                password: hash
            })
            console.log(`${fromClient} created account ${msg.username}`)
            return true
        })

        this.server.messages.register(AccountLogin, async (msg, fromClient) => {
            const account = await Account.findOne({where:{username:msg.username}})
            if (!account) {
                return msg.addError("User does not exist")
            }

            const success = await bcrypt.compare(msg.password!, account.password)
            if (!success) {
                return msg.addError("Password does not match")
            }

            this.login(fromClient, account)
            return true
        })
    }

    login(client:Client, account:Account) {
        //Find anyone else logged in to the same account and log them out
        for (const otherClient of this.clients.values()) {
            if (otherClient.account && otherClient.account.id == account.id) {
                this.logout(otherClient, "Logged in from another location")
                break
            }
        }

        client.account = account
    }

    logout(client:Client, reason:string = "") {
        if (client.world) {
            client.world.removeClient(client)
        }
        client.account = undefined
        if (client.isConnected) {
            client.send({
                type: "logout",
                reason
            })
        }
    }
}