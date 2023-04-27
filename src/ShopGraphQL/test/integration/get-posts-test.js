const request = require("supertest");
const {expect} = require('chai');
const baseURL = "http://localhost:8099";

describe('Get Posts request', () => {
  it('should fetch posts', async () => {
    const response = await request(baseURL)
      .get("/feed/posts")
      .set('Authorization', 'Bearer ');

    expect(response.statusCode).to.be.equal(200);
  });
});