import { Migration } from '../scripts/umzug';
import { schema } from '../models/user';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('users', schema);
  await sequelize.getQueryInterface().addIndex('users', ['publicAddress'], {
    unique: true,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('users');
};
