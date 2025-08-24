import fs from "fs";

import { getCorrectExtensionFromMimeType } from "../file";

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

  test("getCorrectExtensionFromMimeType should handle various MIME types", () => {
    expect(getCorrectExtensionFromMimeType("image/jpeg")).toBe("jpg");
    expect(getCorrectExtensionFromMimeType("image/png")).toBe("png");
    expect(getCorrectExtensionFromMimeType("audio/mpeg")).toBe("mp3");
  });

  // Note: This test would require a real HTTP server to test actual file downloads
  // For now, we'll just test the MIME type detection function
  test.skip("downloadFile should correct file extensions based on MIME type", async () => {
    // This is a placeholder for a more comprehensive integration test
    // In a real scenario, we would need to set up a test server with files
    // that have mismatched extensions and MIME types
  });
});