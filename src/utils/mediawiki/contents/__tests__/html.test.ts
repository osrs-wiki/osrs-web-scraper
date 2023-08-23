import MediaWikiHTML from "../html";
import MediaWikiText from "../text";

describe("MediaWikiHTML", () => {
  test("it should build correctly", () => {
    const result = new MediaWikiHTML("center", [new MediaWikiText("test")]);
    expect(result.build()).toBe("<center>\ntest\n</center>\n");
  });

  test("it should build correctly with params", () => {
    const result = new MediaWikiHTML(
      "center",
      [new MediaWikiText("test"), new MediaWikiText("test2", { bold: true })],
      { param: "123" }
    );
    expect(result.build()).toBe(
      "<center param=\"123\">\ntest'''test2'''\n</center>\n"
    );
  });
});
