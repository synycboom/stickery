import * as dotenv from 'dotenv';

dotenv.config();

import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { initialize } from './models';
import categoryRoutes from './apis/category';
import stickerRoutes from './apis/sticker';
import postRoutes from './apis/post';
import authRoutes from './apis/auth';
import errorHandler from './errors/handler';
import { authenticateToken } from './apis/middleware';

const app: Application = express();
const port = process.env.PORT || 8080;
const domains: string[] = [];

app.use(
  cors({
    origin: [/localhost:*/, ...domains],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/v1/categories', authenticateToken, categoryRoutes);
app.use('/v1/stickers', authenticateToken, stickerRoutes);
app.use('/v1/posts', authenticateToken, postRoutes);
app.use('/v1/auth', authRoutes);
app.use(errorHandler);

async function start() {
  await initialize();

  app.listen(port, (): void => {
    console.log(`Running server on port ${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
