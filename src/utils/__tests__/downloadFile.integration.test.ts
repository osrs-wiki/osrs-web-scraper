import fs from "fs";

import { getCorrectExtensionFromMimeType, findFileByBaseName } from "../file";

describe("downloadFile integration tests", () => {
  const testDir = "/tmp/test-downloads";

  beforeAll(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  beforeEach(() => {
    // Clean test directory before each test
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir);
      files.forEach(file => fs.unlinkSync(`${testDir}/${file}`));
    }
  });

  test("getCorrectExtensionFromMimeType should handle various MIME types", () => {
    expect(getCorrectExtensionFromMimeType("image/jpeg")).toBe("jpg");
    expect(getCorrectExtensionFromMimeType("image/png")).toBe("png");
    expect(getCorrectExtensionFromMimeType("audio/mpeg")).toBe("mp3");
  });

  test("findFileByBaseName should find files regardless of extension", () => {
    // Create test files with different extensions
    fs.writeFileSync(`${testDir}/test-image.png`, "fake png data");
    fs.writeFileSync(`${testDir}/test-image.jpg`, "fake jpg data");
    fs.writeFileSync(`${testDir}/another-file.gif`, "fake gif data");

    // Should find the first matching file
    const result1 = findFileByBaseName(testDir, "test-image");
    expect(result1).toBeDefined();
    expect(result1).toMatch(/test-image\.(png|jpg)$/);

    // Should find exact match
    const result2 = findFileByBaseName(testDir, "another-file");
    expect(result2).toBe("another-file.gif");

    // Should return undefined for non-existent file
    const result3 = findFileByBaseName(testDir, "non-existent");
    expect(result3).toBeUndefined();

    // Should return undefined for non-existent directory
    const result4 = findFileByBaseName("/tmp/non-existent-dir", "test-image");
    expect(result4).toBeUndefined();
  });

  // Note: This test would require a real HTTP server to test actual file downloads
  // For now, we'll just test the MIME type detection function
  test.skip("downloadFile should correct file extensions based on MIME type", async () => {
    // This is a placeholder for a more comprehensive integration test
    // In a real scenario, we would need to set up a test server with files
    // that have mismatched extensions and MIME types
  });
});