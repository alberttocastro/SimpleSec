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
  birth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  baptism: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  privilege: {
    type: DataTypes.ENUM('Elder', 'Ministerial Servant'),
    allowNull: true
  },
  service: {
    type: DataTypes.ENUM('Publisher', 'Regular Pioneer', 'Special Pioneer', 'Missionary'),
    allowNull: false,
    defaultValue: 'Publisher'
  },
  anointed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  male: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  tableName: 'People', // Changed to match the capitalization of the model name
  freezeTableName: true // Prevent Sequelize from pluralizing the table name
});

export default Person as any;

export interface _Person {
  id?: number;
  name: string;
  birth: Date;
  baptism?: Date;
  privilege?: 'Elder' | 'Ministerial Servant' | null;
  service: 'Publisher' | 'Regular Pioneer' | 'Special Pioneer' | 'Missionary';
  anointed: boolean;
}
