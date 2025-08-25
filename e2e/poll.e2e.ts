import * as fs from "fs";

import { runCLICommand, cleanupOutput } from "./utils/cli";

describe("Poll Command E2E Tests", () => {
  // Note: Tests assume the project is already built with `npm run build`

  afterEach(async () => {
    await cleanupOutput();
  });

  it("should show help for poll command", async () => {
    const result = await runCLICommand({
      command: "node",
      args: [
        "-r",
        "typescript-transform-paths/register",
        "./dist/src/index.js",
        "poll",
        "--help",
      ],
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Scrape an OSRS poll");
  });

  it("should require poll URL argument", async () => {
    const result = await runCLICommand({
      command: "node",
      args: [
        "-r",
        "typescript-transform-paths/register",
        "./dist/src/index.js",
        "poll",
      ],
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain(
      "error: missing required argument 'string'"
    );
  });

  // This test requires Chrome/Chromium and internet access
  const shouldSkipScraping =
    process.env.CI || process.env.PUPPETEER_SKIP_DOWNLOAD;

  (shouldSkipScraping ? it.skip : it)(
    "should scrape poll and generate MediaWiki content",
    async () => {
      const pollUrl =
        "https://secure.runescape.com/m=poll/a=13/oldschool/results?id=1708";

      const result = await runCLICommand({
        command: "node",
        args: [
          "-r",
          "typescript-transform-paths/register",
          "./dist/src/index.js",
          "poll",
          pollUrl,
        ],
        timeout: 180000, // 3 minutes for scraping
      });

      expect(result.exitCode).toBe(0);

      // Check that output files were created
      const outDir = "./out/poll";
      expect(fs.existsSync(outDir)).toBe(true);

      // Find the generated file
      const files = fs.readdirSync(outDir);
      expect(files.length).toBeGreaterThan(0);

      const pollFile = files.find((file: string) => file.endsWith(".txt"));
      expect(pollFile).toBeDefined();

      if (pollFile) {
        const filePath = `${outDir}/${pollFile}`;
        const content = fs.readFileSync(filePath, "utf-8");

        // Verify it contains MediaWiki poll content
        expect(content).toContain("{{PollWrapper|top}}");
        expect(content).toContain("{{PollWrapper|bottom}}");
        expect(content).toMatchSnapshot("poll-1708.txt");
      }
    }
  );
});
