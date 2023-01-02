const Sequelize = require('sequelize');

const sequelize = new Sequelize.Sequelize('nodejs_course', 'root', null, {
  dialect: 'mysql',
  host: 'nodejs_course_mysql',
  port: 3306,
});

module.exports = sequelize;
