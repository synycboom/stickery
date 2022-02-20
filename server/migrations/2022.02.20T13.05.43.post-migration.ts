import { Migration } from '../scripts/umzug';
import { schema } from '../models/post';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('posts', schema);
  await sequelize.getQueryInterface().addIndex('posts', ['foreignId', 'platform'], {
    unique: true,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('posts');
};
