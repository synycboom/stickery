import * as dotenv from 'dotenv';

dotenv.config();

import express, { Application, Request, Response } from "express";
import { initialize } from './models';
import categoryRoutes from './apis/category';

const app: Application = express();
const port = process.env.PORT || 8080;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
      message: "Hello World!",
    });
  }
);

app.use('/v1/categories', categoryRoutes);

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
