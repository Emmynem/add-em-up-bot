import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "sessions", timestamps: true })
export class Session extends Model {
	@Column({
		type: DataType.TEXT,
		allowNull: false
	})
	session!: string;

}