import { formatFileName, getCorrectExtensionFromMimeType } from "../file";

describe("file utils", () => {
  test("formatFileName should replace invalid characters", () => {
    expect(formatFileName("this | is a : test&nbsp; ???")).toBe(
      "this - is a - test"
    );
  });

  test("getCorrectExtensionFromMimeType should return correct extensions for common MIME types", () => {
    expect(getCorrectExtensionFromMimeType("image/jpeg")).toBe("jpg");
    expect(getCorrectExtensionFromMimeType("image/jpg")).toBe("jpg");
    expect(getCorrectExtensionFromMimeType("image/png")).toBe("png");
    expect(getCorrectExtensionFromMimeType("image/gif")).toBe("gif");
    expect(getCorrectExtensionFromMimeType("image/webp")).toBe("webp");
    expect(getCorrectExtensionFromMimeType("audio/mpeg")).toBe("mp3");
    expect(getCorrectExtensionFromMimeType("audio/wav")).toBe("wav");
  });

  test("getCorrectExtensionFromMimeType should fallback gracefully for unknown MIME types", () => {
    expect(getCorrectExtensionFromMimeType("image/unknownformat")).toBe("unknownformat");
    expect(getCorrectExtensionFromMimeType("application/unknown")).toBe("unknown");
    expect(getCorrectExtensionFromMimeType("invalidmimetype")).toBe("bin");
  });
});
