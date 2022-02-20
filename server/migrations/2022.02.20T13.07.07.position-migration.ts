import { Migration } from '../scripts/umzug';
import { schema } from '../models/position';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().createTable('positions', schema);
  await sequelize.getQueryInterface().addIndex('positions', ['postId', 'location'], {
    unique: true,
  });
  await sequelize.getQueryInterface().addConstraint('positions', {
    fields: ['userId'],
    type: 'foreign key',
    references: {
      table: 'users',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  await sequelize.getQueryInterface().addConstraint('positions', {
    fields: ['postId'],
    type: 'foreign key',
    references: {
      table: 'posts',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.getQueryInterface().dropTable('positions');
};
