import {
  MediaWikiBreak,
  MediaWikiBuilder,
  MediaWikiContent,
  MediaWikiTemplate,
  MediaWikiText,
} from "@osrs-wiki/mediawiki-builder";

import NewsYoutubeTransformer from "../youtubeTransformer";

describe("NewsYoutubeTransformer", () => {
  it("should wrap a standalone YouTube template in center tags", () => {
    const youtubeTemplate = new MediaWikiTemplate("Youtube", {
      collapsed: true,
    });
    youtubeTemplate.add("", "ZNePfBmCZbM");

    const originalContent: MediaWikiContent[] = [youtubeTemplate];
    
    const transformed = new NewsYoutubeTransformer().transform(originalContent);
    
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should wrap YouTube template with following caption in center tags", () => {
    const youtubeTemplate = new MediaWikiTemplate("Youtube", {
      collapsed: true,
    });
    youtubeTemplate.add("", "ZNePfBmCZbM");

    const originalContent: MediaWikiContent[] = [
      youtubeTemplate,
      new MediaWikiBreak(),
      new MediaWikiText(
        "If you can't see the fantastic video by [https://x.com/_amentos Amentos] above, [https://www.youtube.com/watch?v=ZNePfBmCZbM click here]."
      ),
    ];
    
    const transformed = new NewsYoutubeTransformer().transform(originalContent);
    
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should wrap YouTube playlist template in center tags", () => {
    const youtubeTemplate = new MediaWikiTemplate("Youtube", {
      collapsed: true,
    });
    youtubeTemplate.add("type", "playlist");
    youtubeTemplate.add("", "PLRs68iqW7gYvSyTqu12WFMMXYZM-2regV");

    const originalContent: MediaWikiContent[] = [youtubeTemplate];
    
    const transformed = new NewsYoutubeTransformer().transform(originalContent);
    
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should not transform non-YouTube templates", () => {
    const otherTemplate = new MediaWikiTemplate("SomeOtherTemplate", {
      collapsed: true,
    });
    otherTemplate.add("", "value");

    const originalContent: MediaWikiContent[] = [
      otherTemplate,
      new MediaWikiBreak(),
      new MediaWikiText("Some text"),
    ];
    
    const transformed = new NewsYoutubeTransformer().transform(originalContent);
    
    expect(transformed).toEqual(originalContent);
  });

  it("should handle mixed content correctly", () => {
    const youtubeTemplate = new MediaWikiTemplate("Youtube", {
      collapsed: true,
    });
    youtubeTemplate.add("", "ZNePfBmCZbM");

    const otherTemplate = new MediaWikiTemplate("OtherTemplate");

    const originalContent: MediaWikiContent[] = [
      new MediaWikiText("Some text before"),
      new MediaWikiBreak(),
      youtubeTemplate,
      new MediaWikiBreak(),
      new MediaWikiText("YouTube caption"),
      new MediaWikiBreak(),
      otherTemplate,
      new MediaWikiText("Text after"),
    ];
    
    const transformed = new NewsYoutubeTransformer().transform(originalContent);
    
    expect(
      new MediaWikiBuilder().addContents(transformed).build()
    ).toMatchSnapshot();
  });

  it("should wrap YouTube template with caption inside paragraph (from HTML <p><i>)", () => {
    const youtubeTemplate = new MediaWikiTemplate("Youtube", {
      collapsed: true,
    });
    youtubeTemplate.add("", "-0e4IyRtPwY");

    // This simulates what happens when parsing <p><i>caption</i></p>
    // The paragraph parser creates a MediaWikiText with the italic text and a break as children
    const paragraphText = new MediaWikiText([
      new MediaWikiText("If you can't see the video above, click ", { italics: true }),
      new MediaWikiText("[https://www.youtube.com/watch?v=-0e4IyRtPwY here]", { italics: true }),
      new MediaWikiText("!", { italics: true }),
      new MediaWikiBreak(),
    ], { italics: true });

    const originalContent: MediaWikiContent[] = [
      youtubeTemplate,
      paragraphText,
    ];
    
    const transformed = new NewsYoutubeTransformer().transform(originalContent);
    
    const result = new MediaWikiBuilder().addContents(transformed).build();
    
    // The caption should be inside the center tags, not outside
    expect(result).toContain("<center>");
    expect(result).toContain("{{Youtube|-0e4IyRtPwY}}");
    expect(result).toContain("If you can't see the video above");
    expect(result).toContain("</center>");
    
    // Check that caption comes before closing center tag
    const centerCloseIndex = result.indexOf("</center>");
    const captionIndex = result.indexOf("If you can't see the video above");
    expect(captionIndex).toBeLessThan(centerCloseIndex);
    
    expect(result).toMatchSnapshot();
  });
});