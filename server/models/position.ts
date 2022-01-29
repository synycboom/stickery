import { Sequelize, DataTypes } from 'sequelize';
import NotFoundError from '../errors/notfound';
import UnauthorizedError from '../errors/unauthorized';

export default function (sequelize: Sequelize) {
  return sequelize.define('position', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stickerId: {
      type: DataTypes.INTEGER,
    },
    nftTokenAddress: {
      type: DataTypes.STRING,
    },
    nftTokenId: {
      type: DataTypes.TEXT,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spec: {
      type: DataTypes.JSON,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
      indexes: [
        {
          unique: true,
          fields: ['postId', 'number'],
        }
      ]
  });
};

type UpdatePositionParams = {
  postId: number,
  number: number,
  stickerId?: number,
  nftTokenAddress?: string,
  nftTokenId?: string,
  userId: number,
  spec: Object,
}

export async function updatePosition(
  sequelize: Sequelize,
  params: UpdatePositionParams,
) {
  const tx = await sequelize.transaction();

  try {
    const [position] = await sequelize.models.position.findOrCreate({
      where: {
        postId: params.postId,
        number: params.number,
      },
      defaults: {
        userId: params.userId,
      },
      transaction: tx,
    });

    position.set({
      stickerId: params.stickerId,
      nftTokenAddress: params.nftTokenAddress,
      nftTokenId: params.nftTokenId,
      spec: params.spec,
      userId: params.userId,
    });

    await position.save({ transaction: tx });
    await tx.commit();
  } catch(err) {
    await tx.rollback();

    throw err;
  }
};

type RemovePositionParams = {
  postId: number,
  number: number,
  userId: number,
}

export async function removePosition(sequelize: Sequelize, params: RemovePositionParams) {
  const position = await sequelize.models.position.findOne({
    where: {
      postId: params.postId,
      number: params.number,
    },
  });
  if (!position) {
    throw new NotFoundError();
  }
  if (position.getDataValue('userId') !== params.userId) {
    throw new UnauthorizedError();
  }

  await position.destroy();
}
