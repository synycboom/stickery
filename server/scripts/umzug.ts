import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

import sequelize from '../db';
import { Umzug, SequelizeStorage } from 'umzug';

export const migrator = new Umzug({
	migrations: {
		glob: ['migrations/*.ts', { cwd: process.cwd() }],
	},
	context: sequelize,
	storage: new SequelizeStorage({
		sequelize,
	}),
	logger: console,
});

export type Migration = typeof migrator._types.migration;
