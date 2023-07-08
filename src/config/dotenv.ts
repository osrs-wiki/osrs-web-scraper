import * as dotenv from "dotenv";

dotenv.config();

export type Environment = "test" | "development" | "stage" | "production";

export type Config = {
  environment: Environment;
};

const config: Config = {
  environment: process.env.NODE_ENV as Environment,
};

export default config;
