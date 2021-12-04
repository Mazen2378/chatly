const { User } = require('../models');

module.exports = {
	Query: {
		users: async () => {
			try {
				const users = await User.findAll();
				return users;
			} catch (err) {
				console.error(err);
			}
		},
	},
	Mutation: {
		register: async (parent, { username, email }) => {
			try {
				const user = await User.create({ username, email });
				return user;
			} catch (err) {
				console.error(err);
			}
		},
	},
};
