import MediaWikiHeader from "../header";
import MediaWikiText from "../text";

describe("MediaWikiHeader", () => {
  test("it should build correctly with a string value", () => {
    const header = new MediaWikiHeader("Test", 2);
    expect(header.build()).toBe("==Test==");
  });

  test("it should build correctly with a non-array MediaWikiContent", () => {
    const header = new MediaWikiHeader(
      new MediaWikiText("Test", { italics: true }),
      2
    );
    expect(header.build()).toBe("==''Test''==");
  });

  test("it should build correctly with an array of MediaWikiContent", () => {
    const header = new MediaWikiHeader(
      [
        new MediaWikiText("Start "),
        new MediaWikiText("Test", { italics: true }),
        new MediaWikiText(" End"),
      ],
      3
    );
    expect(header.build()).toBe("===Start ''Test'' End===");
  });
});
