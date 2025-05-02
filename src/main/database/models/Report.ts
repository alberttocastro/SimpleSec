import { DataTypes, Model, Sequelize } from 'sequelize';
import Person from './Person';
import sequelize from '../database'; // Import the sequelize instance

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'People', // Changed to match Person's tableName
      key: 'id'
    }
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hours: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  participated: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  bibleStudies: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  freezeTableName: true // Prevent Sequelize from pluralizing the table name
});

// Set up associations with proper reference to the table name
Report.belongsTo(Person, { 
  foreignKey: 'userId',
  targetKey: 'id',
  as: 'user',
  constraints: false // Temporarily disable constraints to help with initialization
});

// Person can have many Reports
Person.hasMany(Report, {
  foreignKey: 'userId',
  sourceKey: 'id',
  as: 'reports',
  constraints: false
});

export default Report as any;
