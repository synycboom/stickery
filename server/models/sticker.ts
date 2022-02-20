import { Sequelize, DataTypes } from 'sequelize';

export const schema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
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
  return sequelize.define('stickers', schema);
};

export const isValidStickerId = async (sequelize: Sequelize, id: string) => {
  const count = await sequelize.models.stickers.count({
    where: {
      id,
    }
  });

  return count > 0;
};
