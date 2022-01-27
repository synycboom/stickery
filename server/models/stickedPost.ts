import { Sequelize, DataTypes } from 'sequelize';

export default function(sequelize: Sequelize) {
  return sequelize.define('stickedPost', {
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
    postId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userWallet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
