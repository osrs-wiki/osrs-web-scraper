import { runCLICommand, cleanupOutput } from "./utils/cli";

describe("CLI E2E Tests", () => {
  beforeAll(async () => {
    // Ensure the project is built before running e2e tests
    const { exec } = require("child_process");
    const { promisify } = require("util");
    const execAsync = promisify(exec);
    
    try {
      await execAsync("npm run build", { timeout: 60000 });
    } catch (error) {
      console.warn("Build failed, tests may fail:", error);
    }
  });

  afterEach(async () => {
    await cleanupOutput();
  });

  describe("Main CLI", () => {
    it("should show help when --help is passed", async () => {
      const result = await runCLICommand({
        command: "node",
        args: ["-r", "typescript-transform-paths/register", "./dist/src/index.js", "--help"],
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
        args: ["-r", "typescript-transform-paths/register", "./dist/src/index.js", "--version"],
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe("News Command", () => {
    it("should show help for news command", async () => {
      const result = await runCLICommand({
        command: "node",
        args: ["-r", "typescript-transform-paths/register", "./dist/src/index.js", "news", "--help"],
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("Scrape an OSRS news posts");
    });

    // This test requires Chrome/Chromium and internet access
    // Skip if in CI or restricted environment
    const shouldSkipScraping = process.env.CI || process.env.PUPPETEER_SKIP_DOWNLOAD;
    
    (shouldSkipScraping ? it.skip : it)("should scrape news post and generate MediaWiki content", async () => {
      const newsUrl = "https://secure.runescape.com/m=news/a=13/sailing---resources--skilling-activities-poll?oldschool=1";
      
      const result = await runCLICommand({
        command: "node",
        args: ["-r", "typescript-transform-paths/register", "./dist/src/index.js", "news", newsUrl],
        timeout: 180000, // 3 minutes for scraping
      });

      expect(result.exitCode).toBe(0);
      
      // Check that output files were created
      const fs = require("fs");
      const outDir = "./out/news";
      expect(fs.existsSync(outDir)).toBe(true);
      
      // Find the generated file (name will be based on the article title)
      const files = fs.readdirSync(outDir);
      expect(files.length).toBeGreaterThan(0);
      
      const newsFile = files.find((file: string) => file.endsWith(".txt"));
      expect(newsFile).toBeDefined();
      
      if (newsFile) {
        const filePath = `${outDir}/${newsFile}`;
        const content = fs.readFileSync(filePath, "utf-8");
        
        // Verify it contains MediaWiki content
        expect(content).toContain("{{Update");
        expect(content).toMatchSnapshot("news-sailing-poll.txt");
      }
    });
  });

  describe("Poll Command", () => {
    it("should show help for poll command", async () => {
      const result = await runCLICommand({
        command: "node",
        args: ["-r", "typescript-transform-paths/register", "./dist/src/index.js", "poll", "--help"],
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("Scrape an OSRS poll");
    });

    it("should require poll URL argument", async () => {
      const result = await runCLICommand({
        command: "node",
        args: ["-r", "typescript-transform-paths/register", "./dist/src/index.js", "poll"],
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("error: missing required argument 'string'");
    });

    // This test requires Chrome/Chromium and internet access
    const shouldSkipScraping = process.env.CI || process.env.PUPPETEER_SKIP_DOWNLOAD;
    
    (shouldSkipScraping ? it.skip : it)("should scrape poll and generate MediaWiki content", async () => {
      const pollUrl = "https://secure.runescape.com/m=poll/a=13/oldschool/results?id=1708";
      
      const result = await runCLICommand({
        command: "node",
        args: ["-r", "typescript-transform-paths/register", "./dist/src/index.js", "poll", pollUrl],
        timeout: 180000, // 3 minutes for scraping
      });

      expect(result.exitCode).toBe(0);
      
      // Check that output files were created
      const fs = require("fs");
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
    });
  });

  describe("Worlds Command", () => {
    it("should show help for worlds command", async () => {
      const result = await runCLICommand({
        command: "node",
        args: ["-r", "typescript-transform-paths/register", "./dist/src/index.js", "worlds", "--help"],
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("Scrape the OSRS world list");
    });

    // This test requires Chrome/Chromium and internet access
    const shouldSkipScraping = process.env.CI || process.env.PUPPETEER_SKIP_DOWNLOAD;
    
    (shouldSkipScraping ? it.skip : it)("should scrape worlds list", async () => {
      const result = await runCLICommand({
        command: "node",
        args: ["-r", "typescript-transform-paths/register", "./dist/src/index.js", "worlds"],
        timeout: 180000, // 3 minutes for scraping
      });

      expect(result.exitCode).toBe(0);
    });
  });
});