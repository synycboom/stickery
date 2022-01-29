import jwt from 'jsonwebtoken';
import { requireEnv } from '../utils/env';

export const generateAccessToken = (userId: string, publicAddress: string) => {
  return jwt.sign({ userId, publicAddress }, requireEnv('TOKEN_SECRET'), { expiresIn: '1800s' });
}
