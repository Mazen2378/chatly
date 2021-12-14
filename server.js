const { ApolloServer, gql } = require('apollo-server');

const typeDefs = require('./graphQl/typeDefs');
const resolvers = require('./graphQl/resolvers');
const { sequelize } = require('./models');

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ctx => ctx,
});
server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
	sequelize
		.authenticate()
		.then(() => {
			console.log('Database connected');
		})
		.catch(err => {
			console.error(err);
		});
});
