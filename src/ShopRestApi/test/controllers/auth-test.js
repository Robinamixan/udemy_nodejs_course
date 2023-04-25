const {expect} = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const {env} = require('node:process');

const User = require('../../models/user');
const authController = require('../../controllers/auth');

describe('Auth controller - login', () => {
  before((done) => {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://readWriteUser:somepassword@nodejs_course_mongodb:27017/nosql_db_test')
      .then(() => {
        const user = new User({
          _id: '644665c72cb215e0e9aefb73',
          email: 'test_email',
          password: 'test_password',
          name: 'test',
          posts: []
        });

        return user.save();
      })
      .then(() => {
        done();
      })
      .catch(error => console.log(error));
  })

  afterEach(() => {
    sinon.restore();
  });

  it('Should call next with error if database fails', async () => {
    sinon.stub(User, 'findOne');
    User.findOne.throws(new Error('database error'));

    const mRequest = {
      body: {
        email: 'test_email',
        password: 'test_password',
      }
    }

    const mNext = (arg) => {
      expect(arg).to.be.a('error');
      expect(arg).to.have.property('message', 'database error');
    };

    await authController.login(mRequest, {}, mNext);
  });

  it('should return response with valid user status', async () => {
    const request = {userId: '644665c72cb215e0e9aefb73'};
    const response = {
      statusCode: 500,
      userStatus: null,
      status: function(statusCode) {
        this.statusCode = statusCode;

        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      },
    };

    await authController.getUserStatus(request, response, () => {});
    expect(response.statusCode).to.be.equal(200);
    expect(response.userStatus).to.be.equal('new');
  });

  after((done) => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  })
});