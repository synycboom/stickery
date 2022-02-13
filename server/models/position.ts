import { Sequelize, DataTypes } from 'sequelize';
import NoContentError from '../errors/nocontent';
import UnauthorizedError from '../errors/unauthorized';

export const VALID_TWITTER_POSITIONS = [
  'CAPTION',
  'TOP_LEFT',
  'TOP',
  'TOP_RIGHT',
  'MIDDLE_LEFT',
  'MIDDLE',
  'MIDDLE_RIGHT',
  'BOTTOM_LEFT',
  'BOTTOM',
  'BOTTOM_RIGHT'
];

export const VALID_IG_POSITIONS = [
  'ABOVE_POST',
  'TOP_LEFT',
  'TOP',
  'TOP_RIGHT',
  'MIDDLE_LEFT',
  'MIDDLE',
  'MIDDLE_RIGHT',
  'BOTTOM_LEFT',
  'BOTTOM',
  'BOTTOM_RIGHT',
  'CAPTION',
];

export default function (sequelize: Sequelize) {
  return sequelize.define('position', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    location: {
      type: DataTypes.ENUM(
        ... new Set([...VALID_TWITTER_POSITIONS, ...VALID_IG_POSITIONS]),
      ),
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
          fields: ['postId', 'location'],
        }
      ]
    });
};

type UpdatePositionParams = {
  postId: number,
  location: string,
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
        location: params.location,
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
  } catch (err) {
    await tx.rollback();

    throw err;
  }
};

type RemovePositionParams = {
  postId: number,
  location: string,
  userId: number,
}

export async function removePosition(sequelize: Sequelize, params: RemovePositionParams) {
  const position = await sequelize.models.position.findOne({
    where: {
      postId: params.postId,
      location: params.location,
    },
  });
  if (!position) {
    throw new NoContentError();
  }
  if (position.getDataValue('userId') !== params.userId) {
    throw new UnauthorizedError();
  }

  await position.destroy();
}
