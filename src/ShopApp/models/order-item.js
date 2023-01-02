const Sequelize = require('sequelize');

const sequelizeConnection  = require('../util/database');

module.exports = sequelizeConnection.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER
  }
});
