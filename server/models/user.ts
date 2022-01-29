import { Sequelize, DataTypes } from 'sequelize';
import NotFoundError from '../errors/notfound';

export default function(sequelize: Sequelize) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    publicAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isLowercase: true },
    },
    nonce: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: () => Math.floor(Math.random() * 1000000)
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['publicAddress'],
      }
    ]
  });
};

export const createUser = async (sequelize: Sequelize, publicAddress: string) => {
  const [user] = await sequelize.models.user.findOrCreate({
    where: {
      publicAddress: publicAddress.toLowerCase(),
    },
    defaults: {
      isAdmin: false,
    },
  });

  return user;
};

export const findUser = async (sequelize: Sequelize, publicAddress: string) => {
  const user = await sequelize.models.user.findOne({
    where: {
      publicAddress: publicAddress.toLowerCase(),
    },
  });
  if (!user) {
    throw new NotFoundError();
  }

  return user;
}

export const getNonce = async (sequelize: Sequelize, publicAddress: string) => {
  const user = await sequelize.models.user.findOne({
    where: {
      publicAddress: publicAddress.toLowerCase(),
    }
  });
  if (!user) {
    throw new NotFoundError();
  }

  return user.getDataValue('nonce');
};

export const updateNonce = async (sequelize: Sequelize, publicAddress: string) => {
  await sequelize.models.user.update({
    nonce: Math.floor(Math.random() * 1000000),
  }, {
    where: {
      publicAddress: publicAddress.toLowerCase(),
    }
  });
};
