import {
  MediaWikiBuilder,
  MediaWikiContent,
  MediaWikiText,
} from "@osrs-wiki/mediawiki-builder";

import NewsBoldQuoteTransformer from "../boldQuoteTransformer";

describe("NewsBoldQuoteTransformer", () => {
  it("should convert bold text surrounded by single quotes to use <b> tags", () => {
    // Simulate the problematic case: '**bold**' which would become ''''bold text''''
    const originalContent: MediaWikiContent[] = [
      new MediaWikiText("'"),
      new MediaWikiText("bold text", { bold: true }),
      new MediaWikiText("'"),
    ];
    
    const transformed = new NewsBoldQuoteTransformer().transform(originalContent);
    const output = new MediaWikiBuilder().addContents(transformed).build();
    
    // Should output '<b>bold text</b>' surrounded by quotes
    expect(output).toBe("'<b>bold text</b>'");
  });

  it("should not affect bold text not surrounded by quotes", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiText("This is "),
      new MediaWikiText("bold text", { bold: true }),
      new MediaWikiText(" here."),
    ];
    
    const transformed = new NewsBoldQuoteTransformer().transform(originalContent);
    const output = new MediaWikiBuilder().addContents(transformed).build();
    
    // Should keep normal MediaWiki bold formatting
    expect(output).toBe("This is '''bold text''' here.");
  });

  it("should handle multiple bold sections with quotes", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiText("Here is '"),
      new MediaWikiText("first bold", { bold: true }),
      new MediaWikiText("' and also '"),
      new MediaWikiText("second bold", { bold: true }),
      new MediaWikiText("' text."),
    ];
    
    const transformed = new NewsBoldQuoteTransformer().transform(originalContent);
    const output = new MediaWikiBuilder().addContents(transformed).build();
    
    expect(output).toBe("Here is '<b>first bold</b>' and also '<b>second bold</b>' text.");
  });

  it("should handle quotes without bold text normally", () => {
    const originalContent: MediaWikiContent[] = [
      new MediaWikiText("This is '"),
      new MediaWikiText("normal text"),
      new MediaWikiText("' here."),
    ];
    
    const transformed = new NewsBoldQuoteTransformer().transform(originalContent);
    const output = new MediaWikiBuilder().addContents(transformed).build();
    
    expect(output).toBe("This is 'normal text' here.");
  });

  it("should handle complex bold text with nested content", () => {
    const complexBoldContent = new MediaWikiText([
      new MediaWikiText("bold "),
      new MediaWikiText("with nested"),
    ], { bold: true });
    
    const originalContent: MediaWikiContent[] = [
      new MediaWikiText("Here's '"),
      complexBoldContent,
      new MediaWikiText("' text."),
    ];
    
    const transformed = new NewsBoldQuoteTransformer().transform(originalContent);
    const output = new MediaWikiBuilder().addContents(transformed).build();
    
    expect(output).toBe("Here's '<b>bold with nested</b>' text.");
  });

  it("should fix the exact issue case: prevent ''''bold text'''' formatting", () => {
    // This simulates the exact issue described: '**bold**' creating ''''bold text''''
    const originalContent: MediaWikiContent[] = [
      new MediaWikiText("'"),
      new MediaWikiText("bold text", { bold: true }),
      new MediaWikiText("'"),
    ];
    
    // Without the transformer, this would produce ''''bold text'''' (problematic)
    const untransformed = new MediaWikiBuilder().addContents(originalContent).build();
    expect(untransformed).toBe("''''bold text''''");
    
    // With the transformer, it should produce '<b>bold text</b>' (correct)
    const transformed = new NewsBoldQuoteTransformer().transform(originalContent);
    const output = new MediaWikiBuilder().addContents(transformed).build();
    expect(output).toBe("'<b>bold text</b>'");
  });
});