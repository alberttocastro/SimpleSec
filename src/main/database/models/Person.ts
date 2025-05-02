import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../database'; // Import the sequelize instance

const Person = sequelize.define('Person', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

export default Person as any;
