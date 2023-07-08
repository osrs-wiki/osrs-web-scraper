import MediaWikiHeader from "../header";

describe("MediaWikiHeader", () => {
  test("it should build correctly", () => {
    const header = new MediaWikiHeader("Test", 2);
    expect(header.build()).toBe("==Test==");
  });
});
