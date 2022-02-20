import logger from './logger';

export const requireEnv = (name: string): string => {
  const env = process.env[name];
  if (!env) {
    logger.error(`[requireEnv]: ${name} is not set`)
    process.exit(1);
  }

  return env;
};
