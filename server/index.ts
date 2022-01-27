import * as dotenv from 'dotenv';

dotenv.config();

import express, { Application } from "express";
import { initialize } from './models';
import categoryRoutes from './apis/category';
import stickerRoutes from './apis/sticker';

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/v1/categories', categoryRoutes);
app.use('/v1/stickers', stickerRoutes);

async function start() {
  await initialize();

  app.listen(port, (): void => {
    console.log(`Running server on port ${port}`);
  });
};

start().catch(err => {
  console.error(err);
  process.exit(1);
});
