const {buildSchema} = require('graphql');

module.exports = buildSchema(`
  input UserInput {
    email: String!
    password: String!
    name: String!
  }
  
  input PostInput {
    title: String!
    content: String!
    imageUrl: String!
  }
  
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }
  
  type PostListing {
    posts: [Post!]!
    totalCount: Int!
  }
  
  type AuthData {
    userId: String!
    token: String!
  }
  
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    status: String
    posts: [Post!]!
  }
  
  type RootQuery {
    login(email: String! password:String!): AuthData!
    getPosts(page: Int limit: Int): PostListing!
    getPost(postId: String!): Post!
  }

  type RootMutation {
    createUser(userInput: UserInput): User!
    createPost(postInput: PostInput): Post!
    updatePost(id: ID! postInput: PostInput): Post!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);