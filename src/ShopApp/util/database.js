const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'nodejs_course_mysql',
  port: 3306,
  database: 'nodejs_course',
  user: 'root',
});

module.exports = pool.promise();
