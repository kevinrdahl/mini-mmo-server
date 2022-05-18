import Request from "../Request";

export default class CharacterCreate extends Request {
    type = "characterCreate"
    //In the future this will contain information about the character that the user wishes to create.
    //For now, they get what we give them.
}