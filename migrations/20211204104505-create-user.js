'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			username: {
				allowNull: false,
				type: Sequelize.STRING(20),
				unique: true,
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING(100),
				unique: true,
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			imageURL: Sequelize.STRING,
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('users');
	},
};
