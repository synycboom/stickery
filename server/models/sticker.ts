import { Sequelize, DataTypes } from 'sequelize';

export default function(sequelize: Sequelize) {
  return sequelize.define('sticker', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
