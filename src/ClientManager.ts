import * as bcrypt from "bcrypt"
import Client from "./Client";
import GameServer from "./GameServer";
import AccountCreate from "./Messages/Types/AccountCreate";
import AccountLogin from "./Messages/Types/AccountLogin";
import CharacterCreate from "./Messages/Types/CharacterCreate";
import Account from "./Models/Account";
import Character from "./Models/Character";

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
            console.log(`${fromClient} created account ${account.username}`)
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

            //Get a list of their characters to return
            const characters = await Character.findAll({where:{accountId:account.id}})
            msg.response.characters = characters.map(char => char.describe())

            msg.onResponse(() => {
                this.login(fromClient, account)
            })
            return true
        })

        this.server.messages.register(CharacterCreate, async (msg, fromClient) => {
            if (!fromClient.world) return msg.addError("Not logged in")
            if (fromClient.character) return msg.addError("Already logged in")

            

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
        //later this will be based on their input, but for now there is one world
        this.server.world.addClient(client)
        console.log(`${client} logged in`)
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