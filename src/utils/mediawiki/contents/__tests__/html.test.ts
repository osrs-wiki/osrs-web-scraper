import MediaWikiHTML from "../html";

describe("MediaWikiHTML", () => {
  test("it should build correctly", () => {
    const result = new MediaWikiHTML("center", "test");
    expect(result.build()).toBe("<center>test</center>");
  });
});
