import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "users", timestamps: true })
export class Users extends Model {
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		field: "id"
	})
	id?: number;

	@Column({ 
		type: DataType.STRING, 
		allowNull: false 
	})
	user_telegram_id!: string;

	@Column({ 
		type: DataType.STRING, 
		allowNull: false 
	})
	telegram_id!: string;

	@Column({ 
		type: DataType.STRING, 
		allowNull: false 
	})
	group_id!: string;

	@Column({ 
		type: DataType.ENUM("pending", "invited", "failed"),
		defaultValue: "pending",
		allowNull: false 
	})
	status!: string;

}