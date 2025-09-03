import * as fs from "fs";

import { runCLICommand, cleanupOutput } from "./utils/cli";

describe("Worlds Command E2E Tests", () => {
  // Note: Tests assume the project is already built with `npm run build`

  afterEach(async () => {
    await cleanupOutput();
  });

  it("should show help for worlds command", async () => {
    const result = await runCLICommand({
      command: "node",
      args: [
        "-r",
        "typescript-transform-paths/register",
        "./dist/src/index.js",
        "worlds",
        "--help",
      ],
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Scrape the OSRS world list");
  });

  it("should scrape worlds list", async () => {
    const result = await runCLICommand({
      command: "node",
      args: [
        "-r",
        "typescript-transform-paths/register",
        "./dist/src/index.js",
        "worlds",
      ],
      timeout: 180000, // 3 minutes for scraping
    });

    expect(result.exitCode).toBe(0);

    // Check that output files were created
    const outDir = "./out/worlds";
    expect(fs.existsSync(outDir)).toBe(true);

    // Check that the worlds.txt file was created
    const worldsFile = "worlds.txt";
    const filePath = `${outDir}/${worldsFile}`;
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, "utf-8");

    // Verify it contains MediaWiki world list content
    expect(content).toContain("WorldLine");

    // Verify it contains a specific world line to ensure proper formatting
    expect(content).toContain(
      "{{WorldLine|302|United Kingdom|mems=yes|Trade - Members}}"
    );
  });
});
