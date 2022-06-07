import {DataTypes, Model, Sequelize} from "sequelize"
import {PlainObject} from "../Util/Interfaces"

export default class Character extends Model {
	declare id: number
	declare accountId: number
	declare worldId: number
	declare name: string //declare createTime:Date (confirm!)

	static initialize(sequelize: Sequelize) {
		Character.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true
				},
				worldId: {
					type: DataTypes.INTEGER,
					allowNull: false,
					unique: "nameAndWorld"
				},
				name: {
					type: DataTypes.STRING(100),
					allowNull: false,
					unique: "nameAndWorld"
				}
			},
			{sequelize, modelName: "character"}
		)
	}

	describe(): PlainObject {
		return {
			id: this.id,
			name: this.name
		}
	}
}
