const { pathsToModuleNameMapper } = require("ts-jest");

const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  setupFiles: ["dotenv/config"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts"],
};
