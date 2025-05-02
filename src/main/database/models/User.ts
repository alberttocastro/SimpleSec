import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'persons',
  timestamps: true,
})
export default class Person extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;
  
  @AllowNull(false)
  @Column(DataType.STRING)
  username!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}
