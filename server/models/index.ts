import logger from '../utils/logger';
import initializeCategory from './category';
import initializeSticker from './sticker';
import initializePost from './post';
import initializePosition from './position';
import initializeUser from './user';
import sequelize from '../db';

export async function initialize() {
  await sequelize.authenticate();

  logger.info('[initialize]: DB connection has been established successfully');

  const Category = initializeCategory(sequelize);
  const Sticker = initializeSticker(sequelize);
  const Post = initializePost(sequelize);
  const Position = initializePosition(sequelize);
  const User = initializeUser(sequelize);

  Category.hasMany(Sticker, {
    sourceKey: 'id',
    foreignKey: 'categoryId',
    as: 'stickers',
  });

  Post.hasMany(Position, {
    sourceKey: 'id',
    foreignKey: 'postId',
    as: 'positions',
  });

  User.hasMany(Position, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'positions',
  });

  logger.info('[initialize]: DB models has been initialized');

  return sequelize;
}
