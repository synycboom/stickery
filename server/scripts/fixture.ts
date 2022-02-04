import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

import sequelize from '../db';
import sequelizeFixture from 'sequelize-fixtures';
import initializeCategory from '../models/category'; 
import initializeSticker from '../models/sticker'; 

async function main() {
  sequelize.authenticate();

  const categories = initializeCategory(sequelize);
  const stickers = initializeSticker(sequelize);

  await sequelizeFixture.loadFile('fixtures/categories.json', { categories });
  await sequelizeFixture.loadFile('fixtures/stickers.json', { stickers });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
