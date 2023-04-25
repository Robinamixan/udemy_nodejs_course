const {expect} = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../../middleware/authorization');

describe('Auth middleware', () => {
  afterEach(function () {
    sinon.restore();
  });

  it('should throw error if no authorization header present', () => {
    const request = {
      get: () => {
        return null;
      }
    };

    const reference = authMiddleware.bind(this, request, {}, () => {});
    expect(reference).to.throw('Not authorized.')
  });

  it('should throw error if authorization header is not correct', () => {
    const request = {
      get: () => {
        return 'test_header';
      }
    };

    const reference = authMiddleware.bind(this, request, {}, () => {});
    expect(reference).to.throw()
  });

  it('should throw error if token can not be verified', () => {
    const request = {
      get: () => {
        return 'Bearer test_auth_hey';
      }
    };

    const reference = authMiddleware.bind(this, request, {}, () => {});
    expect(reference).to.throw('jwt malformed')
  });

  it('should yield userId after decoding the token', () => {
    const request = {
      get: () => {
        return 'Bearer test_auth_hey';
      }
    };

    sinon.stub(jwt, 'verify');
    jwt.verify.returns({userId: 'test_id'});

    authMiddleware(request, {}, () => {});
    expect(request).to.have.property('userId', 'test_id');
    expect(jwt.verify.called).to.be.true;
  });
});
