import { DataTypes, Model } from 'sequelize';
import sequelize from './database';

// Define the Sequelize User model
class UserModel extends Model {
  public id!: number;
  public username!: string;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the model
UserModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

export { UserModel };
