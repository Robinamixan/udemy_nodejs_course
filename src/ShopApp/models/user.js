const Sequelize = require('sequelize');

const sequelizeConnection  = require('../util/database');

module.exports = sequelizeConnection.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
  }
});
