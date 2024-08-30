import { getNewsCategory, getNewsUrlIdentifier } from "../newsHeader.utils";

describe("newsHeader.utils", () => {
  test("getNewsUrlIdentifier", () => {
    expect(getNewsUrlIdentifier("https.google.com/abcdef/ghijkl")).toBe(
      "ghijkl"
    );
  });

  test("getNewsCategory case sensitive", () => {
    expect(getNewsCategory("Behind the Scenes updates")).toBe("bts");
  });

  test("getNewsCategory case insensitive", () => {
    expect(getNewsCategory(" behind the scenes updates ")).toBe("bts");
  });
});
