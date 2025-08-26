import fs from "fs";

import { getCorrectExtensionFromMimeType } from "../file";

describe("MIME type detection demo", () => {
  test.skip("should detect and correct mismatched extensions", async () => {
    const testDir = "/tmp/mime-test";
    
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const fakeJpgPath = `${testDir}/fake-image.jpg`;
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    fs.writeFileSync(fakeJpgPath, pngSignature);
    
    const { fileTypeFromFile } = await import("file-type");
    const fileType = await fileTypeFromFile(fakeJpgPath);
    
    expect(fileType).toBeDefined();
    expect(fileType?.mime).toBe("image/png");
    
    const correctExtension = getCorrectExtensionFromMimeType(fileType?.mime || "");
    expect(correctExtension).toBe("png");
    
    const currentExtension = fakeJpgPath.split('.').pop();
    expect(currentExtension).toBe("jpg");
    
    // This demonstrates that we detected a mismatch
    expect(correctExtension).not.toBe(currentExtension);
    
    // Clean up
    if (fs.existsSync(fakeJpgPath)) {
      fs.unlinkSync(fakeJpgPath);
    }
  });
});