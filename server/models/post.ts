import { Sequelize, DataTypes } from 'sequelize';

export const schema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['twitter', 'instagram']],
    }
  },
  foreignId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default function (sequelize: Sequelize) {
  return sequelize.define('posts', schema);
};

export async function getOrCreatePost(sequelize: Sequelize, platform: string, foreignId: string) {
  return await sequelize.models.posts.findOrCreate({
    where: {
      platform,
      foreignId,
    },
  });
};

export async function getPost(sequelize: Sequelize, platform: string, foreignId: string) {
  return await sequelize.models.posts.findOne({
    where: {
      platform,
      foreignId,
    },
  });
};
