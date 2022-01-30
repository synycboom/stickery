import express from 'express';
import asyncHandler from 'express-async-handler';
import { validationResult, checkSchema } from 'express-validator';
import { fromRpcSig, hashPersonalMessage, ecrecover, pubToAddress } from 'ethereumjs-util';
import sequelize from '../db';
import ValidationError from '../errors/validation';
import { createUser, updateNonce, findUser, getNonce } from '../models/user';
import { validateSignature, validateTokenAddress } from '../validation';
import { generateAccessToken } from '../utils/auth';
import { authenticateToken } from './middleware';

const router = express.Router();

const generateChallenge = (nonce: number) => {
  return `I am signing my one-time nonce: ${nonce}`;
};

const publicAddressValidator = (publicAddress: string) => {
  if (!validateTokenAddress(publicAddress)) {
    throw new Error('publicAddress is not valid');
  }

  return true;
};

const challengeValidation = checkSchema(
  {
    publicAddress: {
      custom: {
        options: publicAddressValidator,
      },
    },
  },
  ['query'],
);

const loginValidation = checkSchema({
  publicAddress: {
    custom: {
      options: publicAddressValidator,
    },
  },
  signedChallenge: {
    custom: {
      options: async (signedChallenge, { req }) => {
        const { publicAddress } = req.body;
        if (!validateSignature(signedChallenge)) {
          throw new Error('signedChallenge is not valid');
        }

        const nonce = await getNonce(sequelize, publicAddress);
        const { v, r, s } = fromRpcSig(signedChallenge);
        const msgHash = hashPersonalMessage(Buffer.from(generateChallenge(nonce)));
        const publicKey = ecrecover(msgHash, v, r, s);
        const address = `0x${pubToAddress(publicKey).toString('hex')}`;
        if (address.toLowerCase() !== publicAddress.toLowerCase()) {
          throw new Error('signedChallenge is not valid');
        }

        return true;
      },
    },
  },
});

router.get(
  '/challenge',
  challengeValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const publicAddress = req.query.publicAddress?.toString() || '';
    const user = await createUser(sequelize, publicAddress);
    const challenge = generateChallenge(user.getDataValue('nonce'));

    res.status(200).json({
      challenge,
    });
  }),
);

router.post(
  '/login',
  loginValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array());
    }

    const publicAddress = req.body.publicAddress;
    const user = await findUser(sequelize, publicAddress);
    const token = generateAccessToken(user.getDataValue('id'), publicAddress);
    await updateNonce(sequelize, publicAddress);

    res.cookie('jwt', token, { httpOnly: true }).status(200).json({
      token,
    });
  }),
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    res.clearCookie('jwt').status(204).end();
  }),
);

router.get(
  '/check',
  authenticateToken,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      publicAddress: req.publicAddress,
    });
  }),
);

export default router;
