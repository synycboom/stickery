import { Migration } from '../scripts/umzug';
import { schema } from '../models/category';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('categories', schema);
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('categories');
};
