const { gql } = require('apollo-server');
module.exports = gql`
	type User {
		username: String!
		email: String!
		imageURL: String
		token: String
	}
	type Query {
		users: [User]!
	}
	type Mutation {
		login(username: String!, password: String!): User!
		register(username: String!, email: String!, password: String!): User!
	}
`;
