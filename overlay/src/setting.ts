const requireEnv = (name: string): string => {
  const env = process.env[name];
  if (!env) {
    throw new Error(`[requireEnv]: ${name} is not set`);
  }
  return env;
};

const setting = {
  API_URL: requireEnv('REACT_APP_API_URL'),
};

export default setting;
