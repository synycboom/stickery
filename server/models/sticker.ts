import { Sequelize, DataTypes } from 'sequelize';

export default function(sequelize: Sequelize) {
  return sequelize.define('sticker', {
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
  });
};

export const isValidStickerId = async (sequelize: Sequelize, id: string) => {
  const count = await sequelize.models.sticker.count({
    where: {
      id,
    }
  });

  return count > 0;
};
