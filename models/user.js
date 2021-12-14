'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			username: {
				allowNull: false,
				type: DataTypes.STRING(20),
				unique: true,
			},
			email: {
				allowNull: false,
				type: DataTypes.STRING(100),
				unique: true,
				validate: {
					isEmail: {
						args: true,
						msg: 'email must be a valid adress',
					},
				},
			},
			password: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			imageURL: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'User',
			tableName: 'users',
			timestamps: true,
		}
	);
	return User;
};
