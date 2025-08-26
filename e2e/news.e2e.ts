import * as fs from "fs";

import { runCLICommand, cleanupOutput } from "./utils/cli";

describe("News Command E2E Tests", () => {
  // Note: Tests assume the project is already built with `npm run build`

  afterEach(async () => {
    await cleanupOutput();
  });

  it("should show help for news command", async () => {
    const result = await runCLICommand({
      command: "node",
      args: [
        "-r",
        "typescript-transform-paths/register",
        "./dist/src/index.js",
        "news",
        "--help",
      ],
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Scrape an OSRS news posts");
  });

  it("should require news URL argument when running with URL", async () => {
    const result = await runCLICommand({
      command: "node",
      args: [
        "-r",
        "typescript-transform-paths/register",
        "./dist/src/index.js",
        "news",
      ],
    });

    expect(result.exitCode).toBe(0); // news command accepts optional argument
    // Without URL it should show help or handle gracefully
  });

  it("should scrape news post and generate MediaWiki content",
    async () => {
      const newsUrl =
        "https://secure.runescape.com/m=news/a=13/sailing---resources--skilling-activities-poll?oldschool=1";

      const result = await runCLICommand({
        command: "node",
        args: [
          "-r",
          "typescript-transform-paths/register",
          "./dist/src/index.js",
          "news",
          newsUrl,
        ],
        timeout: 180000, // 3 minutes for scraping
      });

      expect(result.exitCode).toBe(0);

      // Check that output files were created
      const outDir = "./out/news";
      expect(fs.existsSync(outDir)).toBe(true);

      // Find the generated file in subdirectories (name will be based on the article title)
      const subDirs = fs
        .readdirSync(outDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      // Look for .txt files in subdirectories
      let newsFile: string | undefined;
      let newsDir: string | undefined;

      for (const subDir of subDirs) {
        const subDirPath = `${outDir}/${subDir}`;
        const subDirFiles = fs.readdirSync(subDirPath);

        const txtFile = subDirFiles.find((file: string) =>
          file.endsWith(".txt")
        );
        if (txtFile) {
          newsFile = txtFile;
          newsDir = subDir;
          break;
        }
      }

      expect(newsFile).toBeDefined();

      if (newsFile && newsDir) {
        const filePath = `${outDir}/${newsDir}/${newsFile}`;
        const content = fs.readFileSync(filePath, "utf-8");

        // Verify it contains MediaWiki content
        expect(content).toContain("{{Update");
        expect(content).toMatchSnapshot("news-sailing-poll.txt");
      }
    });
});
