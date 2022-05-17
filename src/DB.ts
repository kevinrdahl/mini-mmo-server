import config from "config";
import { Sequelize } from "sequelize";
import Account from "./Models/Account";

const DB = new Sequelize(config.get("db"))

//Initialize models here
Account.initialize(DB)

export { DB }