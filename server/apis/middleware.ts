import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized';
import { requireEnv } from '../utils/env';
import { ExtendedRequest } from './type';

export const authenticateToken = asyncHandler(async (req: ExtendedRequest, res, next) => {
  let token = req.cookies['jwt'];
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    const user = await jwt.verify(token, requireEnv('TOKEN_SECRET')) as any;

    req.publicAddress = user.publicAddress;
    req.userId = user.userId;
    next();
  } catch(err) {
    throw new UnauthorizedError();
  }
});
