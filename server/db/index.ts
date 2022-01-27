import { Sequelize } from "sequelize";
import { requireEnv } from '../utils/env';

const sequelize = new Sequelize(
  requireEnv('DB_NAME'),
  requireEnv('DB_USERNAME'),
  requireEnv('DB_PASSWORD'),
  {
    host: requireEnv('DB_HOST'),
    dialect: 'mysql',
  },
);

export default sequelize;
