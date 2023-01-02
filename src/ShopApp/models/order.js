const Sequelize = require('sequelize');

const sequelizeConnection  = require('../util/database');

module.exports = sequelizeConnection.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});
