// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require("ts-jest");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { compilerOptions } = require("../tsconfig");

module.exports = {
  preset: "ts-jest",
  setupFiles: ["dotenv/config"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/../",
  }),
  testEnvironment: "node",
  testMatch: ["**/e2e/**/*.e2e.ts"],
  testTimeout: 120000, // E2E tests may take longer, especially for scraping
  displayName: "E2E Tests",
};