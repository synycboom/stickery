import express from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult, checkSchema } from 'express-validator';
import isHexadecimal from 'validator/lib/isHexadecimal';
import sequelize from '../db';
import { getOrCreatePost, getPost } from '../models/post';
import { updatePosition, removePosition } from '../models/position';
import { isValidStickerId } from '../models/sticker';
import ValidationError from '../errors/validation';
import { ExtendedRequest } from './type';
import NotFoundError from '../errors/notfound';
import { Op } from 'sequelize';

const router = express.Router();

const listPostsValidator = checkSchema({
  platform: {
    isIn: {
      options: ['twitter', 'instagram'],
      errorMessage: 'platform must be one of "twitter" or "instagram"',
    }
  },
}, ['query']);

router.get(
  '/',
  listPostsValidator,
  asyncHandler(async (req, res) => {
    const { foreignIds, platform } = req.query;
    const where: Record<string, any> = {};
    if (platform) {
      where['platform'] = platform;
    }

    if (foreignIds) {
      const ids = foreignIds.toString().split(','); 

      where['foreignId'] = {
        [Op.in]: ids
      };
    }

    let posts = await sequelize.models.post.findAll({
      where,
      include: { model: sequelize.models.position, as: 'positions' },
    });

    posts = posts.map((item) => item.toJSON());

    res.status(200).json({
      items: posts,
    });
  }
));

const stickValidator = checkSchema({
  foreignId: {
    isString: {
      errorMessage: 'foreignId must be a string referencing to the post in other platform',
    },
    notEmpty: {
      options: {
        ignore_whitespace: true,
      },
      errorMessage: 'foreignId must not be empty',
    }
  },
  platform: {
    exists: {
      errorMessage: 'platform must be defined',
    },
    isIn: {
      options: ['twitter', 'instagram'],
      errorMessage: 'platform must be one of "twitter" or "instagram"',
    }
  },
  position: {
    custom: {
      options: async (position, { req }) => {
        if (!position) {
          throw new Error('position must be defined');
        }

        const number = parseInt(position.number);
        if (isNaN(number)) {
          throw new Error('position.number must be a number');
        }

        const { platform } = req.body;
        if (platform === 'twitter') {
          if (number < 0 || number > 7) {
            throw new Error('position.number must be a 1-7');
          }
        }
        if (platform === 'instagram') {
          if (number < 0 || number > 11) {
            throw new Error('position.number must be a 1-7');
          }
        }

        const { stickerId, nftTokenAddress, nftTokenId } = position;
        if (!stickerId && (!nftTokenAddress || !nftTokenId)) {
          throw new Error('position should have either sticker or nft');
        }
        if (stickerId && !await isValidStickerId(sequelize, stickerId)) {
          throw new Error('position.stickerId is not valid');
        }
        if (nftTokenAddress) {
          if (!nftTokenAddress.startsWith('0x') || !isHexadecimal(nftTokenAddress) || nftTokenAddress.length !== 42) {
            throw new Error('position.nftTokenAddress is not a valid token address');
          }
        }

        return true;
      }
    },
  },
});

router.post(
  '/stick',
  stickValidator,
  asyncHandler(async (req: ExtendedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }
    
    const { platform, foreignId, position } = req.body;
    const [post] = await getOrCreatePost(sequelize, platform, foreignId);
    await updatePosition(sequelize, {
      postId: post.getDataValue('id'),
      number: position.number,
      spec: position.spec,
      stickerId: position.stickerId,
      nftTokenAddress: position.nftTokenAddress,
      nftTokenId: position.nftTokenId,
      userId: req.userId!,
    });

    res.status(200).send({});
  })
);

router.post(
  '/remove',
  stickValidator,
  asyncHandler(async (req: ExtendedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }
    
    const { platform, foreignId, position } = req.body;
    const post = await getPost(sequelize, platform, foreignId);
    if (!post) {
      throw new NotFoundError();
    }

    await removePosition(sequelize, {
      postId: post.getDataValue('id'),
      number: position.number,
      userId: req.userId!,
    });

    res.status(204).end();
  })
);

export default router;
