import { Sequelize, DataTypes } from 'sequelize';

export default function (sequelize: Sequelize) {
  return sequelize.define('post', {
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
  },
    {
      indexes: [
        {
          unique: true,
          fields: ['foreignId', 'platform'],
        }
      ]
    }
  );
};

export async function getOrCreatePost(sequelize: Sequelize, platform: string, foreignId: string) {
  return await sequelize.models.post.findOrCreate({
    where: {
      platform,
      foreignId,
    },
  });
};

export async function getPost(sequelize: Sequelize, platform: string, foreignId: string) {
  return await sequelize.models.post.findOne({
    where: {
      platform,
      foreignId,
    },
  });
};
