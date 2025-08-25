import { runCLICommand } from "./utils/cli";

describe("Main CLI E2E Tests", () => {
  // Note: Tests assume the project is already built with `npm run build`

  it("should show help when --help is passed", async () => {
    const result = await runCLICommand({
      command: "node",
      args: [
        "-r",
        "typescript-transform-paths/register",
        "./dist/src/index.js",
        "--help",
      ],
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage: OSRS Web Scraper");
    expect(result.stdout).toContain("Commands:");
    expect(result.stdout).toContain("news");
    expect(result.stdout).toContain("poll");
    expect(result.stdout).toContain("worlds");
  });

  it("should show version when --version is passed", async () => {
    const result = await runCLICommand({
      command: "node",
      args: [
        "-r",
        "typescript-transform-paths/register",
        "./dist/src/index.js",
        "--version",
      ],
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/\d+\.\d+\.\d+/);
  });
});
