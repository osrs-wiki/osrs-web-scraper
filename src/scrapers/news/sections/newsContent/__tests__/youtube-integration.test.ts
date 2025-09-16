import {
  MediaWikiBreak,
  MediaWikiBuilder,
  MediaWikiContent,
  MediaWikiTemplate,
  MediaWikiText,
} from "@osrs-wiki/mediawiki-builder";

import {
  NewsBreakTransformer,
  NewsFileCaptionTransformer,
  NewsFooterTransformer,
  NewsHeaderTransformer,
  NewsYoutubeTransformer,
} from "../../../transformers";

describe("YouTube template integration test", () => {
  it("should center YouTube template with caption through the full processing pipeline", () => {
    // Create content similar to what would be parsed from HTML
    const youtubeTemplate = new MediaWikiTemplate("Youtube", {
      collapsed: true,
    });
    youtubeTemplate.add("", "ZNePfBmCZbM");

    const content: MediaWikiContent[] = [
      youtubeTemplate,
      new MediaWikiBreak(),
      new MediaWikiText(
        "If you can't see the fantastic video by [https://x.com/_amentos Amentos] above, [https://www.youtube.com/watch?v=ZNePfBmCZbM click here]."
      ),
    ];

    // Apply the same transformers as in news.ts
    const builder = new MediaWikiBuilder()
      .addContents(content)
      .addTransformer(new NewsHeaderTransformer())
      .addTransformer(new NewsBreakTransformer())
      .addTransformer(new NewsFileCaptionTransformer())
      .addTransformer(new NewsYoutubeTransformer())
      .addTransformer(new NewsFooterTransformer());

    const result = builder.build();
    
    // Should be wrapped in center tags
    expect(result).toContain("<center>");
    expect(result).toContain("{{Youtube|ZNePfBmCZbM}}");
    expect(result).toContain("If you can't see the fantastic video");
    expect(result).toContain("</center>");
    
    expect(result).toMatchSnapshot();
  });

  it("should center standalone YouTube template without caption", () => {
    const youtubeTemplate = new MediaWikiTemplate("Youtube", {
      collapsed: true,
    });
    youtubeTemplate.add("", "ZNePfBmCZbM");

    const content: MediaWikiContent[] = [youtubeTemplate];

    const builder = new MediaWikiBuilder()
      .addContents(content)
      .addTransformer(new NewsHeaderTransformer())
      .addTransformer(new NewsBreakTransformer())
      .addTransformer(new NewsFileCaptionTransformer())
      .addTransformer(new NewsYoutubeTransformer())
      .addTransformer(new NewsFooterTransformer());

    const result = builder.build();
    
    // Should be wrapped in center tags
    expect(result).toContain("<center>");
    expect(result).toContain("{{Youtube|ZNePfBmCZbM}}");
    expect(result).toContain("</center>");
    
    expect(result).toMatchSnapshot();
  });
});