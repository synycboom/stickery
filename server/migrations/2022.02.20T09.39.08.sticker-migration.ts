import { Migration } from '../scripts/umzug';
import { schema } from '../models/sticker';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('stickers', schema);
  await sequelize.getQueryInterface().addConstraint('stickers', {
    fields: ['categoryId'],
    type: 'foreign key',
    references: {
      table: 'categories',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('stickers');
};
