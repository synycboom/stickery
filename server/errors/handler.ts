import express from 'express';
import ValidationError from './validation';
import NotFoundError from './notfound';
import UnauthorizedError from './unauthorized';

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json(err.toResponse());
  }
  if (err instanceof NotFoundError) {
    return res.status(404).send('Not Found');
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).send('Unauthorized');
  }

  console.error(err);

  res.status(500).send('Internal Server Error');
};

export default errorHandler;
