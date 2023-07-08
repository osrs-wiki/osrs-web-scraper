import config from "@config";

describe("dotenv", () => {
  test("it should load environment", () => {
    expect(config.environment).toBe("test");
  });
});
