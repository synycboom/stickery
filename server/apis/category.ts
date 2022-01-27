import express from 'express';
import asyncHandler from 'express-async-handler';
import { body, validationResult, param } from 'express-validator';
import sequelize from '../db';

const router = express.Router();

// TODO: Pagination
router.get('/', asyncHandler(async (_, res) => {
  const categories = await sequelize.models.category.findAll();

  res.status(200).json({
    items: categories,
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await sequelize.models.category.findOne({
    where: { id },
  });
  if (!category) {
    res.status(404).send('Not Found');
    return;
  }

  res.status(200).json({
    ...category.toJSON(),
  });
}));

router.post(
  '/',
  body('name')
    .isString()
    .withMessage('name must be string')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('name must not be empty'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const category = await sequelize.models.category.create({
      name: req.body.name,
    });

    res.status(201).json({
      ...category.toJSON(),
    });
  })
);

router.patch(
  '/:id',
  param('id')
    .isNumeric()
    .withMessage('id must be an integer'),
  body('name')
    .isString()
    .withMessage('name must be string')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('name must not be empty'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const [updated] = await sequelize.models.category.update({
      name: req.body.name,
    }, {
      where: {
        id: req.params!.id,
      }
    });
    if (!updated) {
      res.status(404).send();
      return
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
    await sequelize.models.category.destroy({
      where: {
        id: req.params!.id,
      }
    });

    res.status(204).json({});
  })
)

export default router;
