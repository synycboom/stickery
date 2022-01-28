import express from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult, checkSchema } from 'express-validator';
import isUrl from 'validator/lib/isUrl';
import isHexadecimal from 'validator/lib/isHexadecimal';
import sequelize from '../db';
import { getOrCreatePost } from '../models/post';
import { updatePosition } from '../models/position';
import { isValidStickerId } from '../models/sticker';
import ValidationError from '../errors/validation';

const router = express.Router();

router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await sequelize.models.post.findOne({
    where: { id },
  });
  if (!post) {
    res.status(404).send('Not Found');
    return;
  }

  res.status(200).json({
    ...post.toJSON(),
  });
}));

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

        const { stickerId, nftTokenAddress, nftTokenId, imageUrl } = position;
        if (!stickerId && (!nftTokenAddress || !nftTokenId)) {
          throw new Error('position should have either sticker or nft');
        }
        if (!isUrl(imageUrl)) {
          throw new Error('position.imageUrl is not a valid url');
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
  asyncHandler(async (req, res) => {
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
      imageUrl: position.imageUrl,
    });

    res.status(200).send({});
  })
);

// router.delete(
//   '/:id',
//   param('id')
//     .isNumeric()
//     .withMessage('id must be an integer'),
//   asyncHandler(async (req, res) => {
//     await sequelize.models.post.destroy({
//       where: {
//         id: req.params!.id,
//       }
//     });

//     res.status(204).json({});
//   })
// )

export default router;
