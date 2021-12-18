const { User } = require('../models');
const gravatar = require('../utils/gravatar');
const bcrypt = require('bcryptjs');
const { UserInputError, AuthenticationError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const { checkPassword, checkEmail } = require('../utils/regex-checks');
const { Op } = require('sequelize');

module.exports = {
	Query: {
		users: async (parent, args, ctx) => {
			try {
				console.log(ctx);
				const token = ctx.req.headers.authorization || null;
				if (!token) {
					throw new AuthenticationError('no token provided');
				}
				const decodedToken = jwt.verify(token, 'Aymmzn');
				const users = await User.findAll({
					where: {
						username: {
							[Op.ne]: decodedToken.username,
						},
					},
				});
				return users;
			} catch (err) {
				console.error(err);
				if (err.message === 'jwt malformed') {
					throw new UserInputError('the provided token is not valid');
				}
			}
		},
	},

	Mutation: {
		login: async (parent, { username, password }) => {
			let errors = {};
			try {
				const user = await User.findOne({
					where: {
						username,
					},
				});
				if (!user) {
					errors.username = 'there is no user with a corresponding username';
					throw errors;
				}
				console.log(user);
				const correctpw = await bcrypt.compare(password, user.password);
				console.log(correctpw);
				if (correctpw) {
					const token = jwt.sign({ username: user.username }, 'Aymmzn');
					user.token = token;
					return user;
				} else {
					errors.password = 'incorrect password';
					throw errors;
				}
			} catch (err) {
				console.log(err);
				throw new AuthenticationError('unable to authanticate', { errors });
			}
		},
		register: async (parent, { username, email, password }) => {
			let errors = {};
			try {
				email = email.trim();
				username = username.trim();
				password = password.trim();
				if (!email) errors.email = 'email cannote be empty';
				if (!username) errors.username = 'username cannote be empty';
				if (!password) errors.password = 'password cannote be empty';
				if (!checkPassword(password)) errors.password = 'invalid password';
				// const userByEmail = await User.findAll({
				// 	where: {
				// 		email: email,
				// 	},
				// });
				// console.log(userByEmail);
				// const userByUsername = await User.findAll({
				// 	where: {
				// 		username: username,
				// 	},
				// });
				// if (userByEmail.length) errors.email = 'email is already used ';
				// if (userByUsername.length)
				// 	errors.username = 'username is already used ';
				if (Object.keys(errors).length > 0) {
					throw errors;
				}

				password = await bcrypt.hash(password, 12);
				const user = await User.create({
					username,
					email,
					password,
					imageURL: gravatar(email),
				});
				const token = jwt.sign({ username: user.username }, 'Aymmzn');
				user.token = token;
				return user;
			} catch (err) {
				console.log(err);
				if (err.name === 'SequelizeUniqueConstraintError') {
					err.errors.forEach(
						e => (errors[e.path] = `${e.path} is already in use`)
					);
				} else if (err.name === 'SequelizeValidationError') {
					err.errors.forEach(e => (errors[e.path] = e.message));
				}
				throw new UserInputError('bad user input ', { errors });
			}
		},
	},
};
