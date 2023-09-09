import { getNewsUrlIdentifier } from "../newsHeader.utils";

describe("newsHeader.utils", () => {
  test("getNewsUrlIdentifier", () => {
    expect(getNewsUrlIdentifier("https.google.com/abcdef/ghijkl")).toBe(
      "ghijkl"
    );
  });
});
