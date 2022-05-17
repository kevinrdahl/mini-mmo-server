import { DataTypes, Model, Sequelize } from "sequelize";

export default class Account extends Model {
    declare id:number
    declare username:string
    declare password:string
    //declare createTime:Date (confirm!)

    static initialize(sequelize:Sequelize) {
        Account.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false
            }
        }, {sequelize})
    }
}