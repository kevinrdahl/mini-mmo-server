import config from "config";
import { Sequelize } from "sequelize";
import Account from "./Models/Account";
import Character from "./Models/Character";

const DB = new Sequelize(config.get("db"))

//Initialize models here
Account.initialize(DB)
Character.initialize(DB)

Account.hasMany(Character)
Character.belongsTo(Account)

export { DB }