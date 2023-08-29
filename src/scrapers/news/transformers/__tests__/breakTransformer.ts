import {
  MediaWikiBreak,
  MediaWikiBuilder,
  MediaWikiContent,
  MediaWikiText,
  MediaWikiTOC,
} from "../../../../utils/mediawiki";
import NewsBreakTransformer from "../breakTransformer";

describe("NewsBreakTransformer", () => {
  it("should combine three lines breaks to one", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiTOC(),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      new MediaWikiBreak(),
      new MediaWikiText("The Old School Team.", { italics: true }),
    ];
    const transformed = new NewsBreakTransformer().transform(originalContent);
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });
});
