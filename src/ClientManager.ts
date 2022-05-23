import * as bcrypt from "bcrypt"
import { createNoSubstitutionTemplateLiteral } from "typescript";
import Client from "./Client";
import World from "./Game/World";
import GameServer from "./GameServer";
import AccountCreate from "./Messages/Types/AccountCreate";
import AccountLogin from "./Messages/Types/AccountLogin";
import CharacterCreate from "./Messages/Types/CharacterCreate";
import CharacterLogin from "./Messages/Types/CharacterLogin";
import Account from "./Models/Account";
import Character from "./Models/Character";
import { GenerateName } from "./Util/NameGen";
import { PickRandom } from "./Util/Utils";

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
            if (fromClient.account) return msg.addError("Already logged in")

            const account = await Account.findOne({where:{username:msg.username}})
            if (!account) return msg.addError("User does not exist")

            const passwordMatch = await bcrypt.compare(msg.password!, account.password)
            if (!passwordMatch) return msg.addError("Password does not match")

            //Get a list of their characters to return
            const characters = await Character.findAll({where:{accountId:account.id}})
            msg.response.characters = characters.map(char => char.describe())

            msg.onResponse(() => {
                this.login(fromClient, account)
            })
            return true
        })

        this.server.messages.register(CharacterCreate, async (msg, fromClient) => {
            if (!fromClient.world || !fromClient.account) return msg.addError("Not logged in")
            if (fromClient.character) return msg.addError("Already logged in")

            const character = await Character.create({
                name: GenerateName(),
                accountId: fromClient.account?.id,
                worldId: fromClient.world?.id
            })

            msg.response.character = character.describe()

            return true
        })

        this.server.messages.register(CharacterLogin, async (msg, fromClient) => {
            if (!fromClient.world || !fromClient.account) return msg.addError("Not logged in")
            if (fromClient.character) return msg.addError("Already logged in")

            const character = await Character.findOne({where:{id:msg.characterId}})
            if (!character) return msg.addError("No such character")
            if (character.accountId != fromClient.account.id) return msg.addError("Character belongs to another account")

            fromClient.character = character

            msg.onResponse(() => {
                //put them in a random room I guess?
                const rooms = Array.from(this.server.world.rooms.values())
                const room = PickRandom(rooms)!
                room.addClient(fromClient)
            })

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
    }

    logout(client:Client, reason:string = "") {
        if (client.world) {
            client.world.removeClient(client)
        }
        client.character = undefined
        client.account = undefined
        if (client.isConnected) {
            client.send({
                type: "logout",
                reason
            })
        }
    }
}