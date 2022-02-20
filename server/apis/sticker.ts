import express from 'express';
import { ForeignKeyConstraintError, Op } from 'sequelize';
import asyncHandler from 'express-async-handler';
import { body, validationResult, param } from 'express-validator';
import sequelize from '../db';

const router = express.Router();

// TODO: Pagination
router.get('/', asyncHandler(async (req, res) => {
  const { categoryId, ids } = req.query;
  const where: Record<string, any> = {};
  if (categoryId) {
    where['categoryId'] = categoryId;
  }
  if (ids) {
    where['id'] = {
      [Op.in]: ids.toString().split(',')
    };
  }

  const stickers = await sequelize.models.stickers.findAll({
    where,
  });

  res.status(200).json({
    items: stickers,
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sticker = await sequelize.models.stickers.findOne({
    where: { id },
  });
  if (!sticker) {
    res.status(404).send('Not Found');
    return;
  }

  res.status(200).json({
    ...sticker.toJSON(),
  });
}));

router.post(
  '/',
  body('categoryId')
    .isNumeric()
    .withMessage('categoryId must be a number referencing to a category'),
  body('url')
    .isString()
    .withMessage('url must be string')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('url must not be empty'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { url, categoryId } = req.body;
      const sticker = await sequelize.models.stickers.create({
        url,
        categoryId,
      });

      res.status(201).json({
        ...sticker.toJSON(),
      });
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        res.status(400).json({
          errors: [
            {
              param: 'categoryId',
              msg: 'categoryId is not valid',
            },
          ],
        });

        return;
      }

      throw err;
    }
  })
);

router.patch(
  '/:id',
  param('id')
    .isNumeric()
    .withMessage('id must be an integer'),
  body('categoryId')
    .isNumeric()
    .withMessage('categoryId must be a number referencing to a category'),
  body('url')
    .isString()
    .withMessage('url must be string')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('url must not be empty'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { url, categoryId } = req.body;
      const [updated] = await sequelize.models.stickers.update({
        url, categoryId,
      }, {
        where: {
          id: req.params!.id,
        }
      });
      if (!updated) {
        res.status(404).send();
        return
      }
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        res.status(400).json({
          errors: [
            {
              param: 'categoryId',
              msg: 'categoryId is not valid',
            },
          ],
        });

        return;
      }

      throw err;
    }

    res.status(200).json({});
  })
);

router.delete(
  '/:id',
  param('id')
    .isNumeric()
    .withMessage('id must be an integer'),
  asyncHandler(async (req, res) => {
    await sequelize.models.stickers.destroy({
      where: {
        id: req.params!.id,
      }
    });

    res.status(204).json({});
  })
)

export default router;
