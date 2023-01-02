const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const log = require('./log');

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb://readWriteUser:somepassword@nodejs_course_mongodb:27017/nosql_db')
    .then(client => {
      _db = client.db();
      callback();
    })
    .catch(error => {
      log(error)
      throw error;
    });
};

/**
 * @returns {mongodb.Db}
 */
const getDb = () => {
  if (_db) {
    return _db;
  }

  throw 'No database found!';
}

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
