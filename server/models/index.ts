import initializeCategory from './category';
import initializeSticker from './sticker';
import initializeStickedPost from './stickedPost';
import sequelize from '../db';

export async function initialize() {
  await sequelize.authenticate();
  console.log('[initialize]: DB connection has been established successfully');

  const Category = initializeCategory(sequelize);
  const Sticker = initializeSticker(sequelize);
  const StickedPost = initializeStickedPost(sequelize);

  Category.hasMany(Sticker, {
    sourceKey: "id",
    foreignKey: "categoryId",
    as: "stickers",
    onDelete: 'CASCADE',
  });

  StickedPost.belongsTo(Sticker, {
    foreignKey: "stickerId",
    as: "stickedPosts",
    onDelete: 'CASCADE',
  })

  await Category.sync({ alter: true });
  await Sticker.sync({ alter: true });
  await StickedPost.sync({ alter: true });
  console.log('[initialize]: DB models has been initialized');

  return sequelize;
}
