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
      model: 'Person', // Reference to the Person model
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
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
  timestamps: true
});

// Set up associations the old way
Report.belongsTo(Person, { 
  foreignKey: 'userId',
  as: 'user'
});

export default Report as any;
