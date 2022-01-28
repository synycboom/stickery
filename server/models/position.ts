import { Sequelize, DataTypes } from 'sequelize';

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
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
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
  imageUrl: string,
  stickerId?: number,
  nftTokenAddress?: string,
  nftTokenId?: string,
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
        imageUrl: '',
      },
      transaction: tx,
    });

    position.set({
      stickerId: params.stickerId,
      nftTokenAddress: params.nftTokenAddress,
      nftTokenId: params.nftTokenId,
      imageUrl: params.imageUrl,
      spec: params.spec,
    });

    await position.save({ transaction: tx });
    await tx.commit();
  } catch(err) {
    await tx.rollback();

    throw err;
  }
};
