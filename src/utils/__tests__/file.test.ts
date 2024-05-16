import { formatFileName } from "../file";

describe("file utils", () => {
  test("formatFileName should replace invalid characters", () => {
    expect(formatFileName("this | is a : test&nbsp;")).toBe(
      "this - is a - test"
    );
  });
});
