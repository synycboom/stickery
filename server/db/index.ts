import { Sequelize } from "sequelize";
import { requireEnv } from '../utils/env';
import logger from '../utils/logger';

const sequelize = new Sequelize(
  requireEnv('DB_NAME'),
  requireEnv('DB_USERNAME'),
  requireEnv('DB_PASSWORD'),
  {
    host: requireEnv('DB_HOST'),
    dialect: 'mysql',
    logging: logger.debug.bind(logger),
  },
);

export default sequelize;
