import {
  MediaWikiBuilder,
  MediaWikiContent,
} from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import tableParser from "../table";

describe("table node", () => {
  test("A table with no thead should render", () => {
    const root = parse(
      "<table><tbody><tr><td>header1</td><td>header2</td></tr><tr><td>test</td><td>test</td></tr></tbody></table>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([tableParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("A table with thead should render", () => {
    const root = parse(
      "<table><thead><tr><td>header1</td><td>header2</td></tr></thead><tbody><tr><td>test</td><td>test</td></tr><tr><td>test</td><td>test</td></tr></tbody></table>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([tableParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("A table with empty cells should render without errors", () => {
    const root = parse(
      "<table><tbody><tr><td>header1</td><td>header2</td></tr><tr><td></td><td>test</td></tr><tr><td>test</td><td></td></tr></tbody></table>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([tableParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("A table with whitespace-only cells should render without errors", () => {
    const root = parse(
      "<table><tbody><tr><td>header1</td><td>header2</td></tr><tr><td>   </td><td>test</td></tr><tr><td>test</td><td>  \n  </td></tr></tbody></table>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([tableParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("A table with mixed content including unsupported tags should render", () => {
    const root = parse(
      "<table><tbody><tr><td>header1</td><td>header2</td></tr><tr><td><b>bold</b></td><td><script>alert('test')</script>content</td></tr><tr><td>test<br/></td><td><unsupported>ignored</unsupported>more content</td></tr></tbody></table>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([tableParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("A table with complex nested HTML should render correctly", () => {
    const root = parse(
      "<table><tbody><tr><td>Name</td><td>Description</td></tr><tr><td><i>Item Name</i></td><td>Some <b>bold</b> and <i>italic</i> text with <br/>line breaks</td></tr></tbody></table>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([tableParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("A table with cells containing only ignored elements should render with empty content", () => {
    const root = parse(
      "<table><tbody><tr><td>header1</td><td>header2</td></tr><tr><td><script>ignored</script><style>ignored</style></td><td>visible content</td></tr></tbody></table>"
    );
    const builder = new MediaWikiBuilder();
    builder.addContents([tableParser(root.firstChild)].flat());
    expect(builder.build()).toMatchSnapshot();
  });

  test("should handle tables without throwing 'Cannot read properties of undefined' error", () => {
    // This HTML structure simulates the conditions that caused the original error
    const problemHTML = `
      <table>
        <tbody>
          <tr>
            <td>Tier</td>
            <td>Category</td>
            <td>Title</td>
            <td>Description</td>
          </tr>
          <tr>
            <td>Elite</td>
            <td>Kill Count</td>
            <td>Doom Adept</td>
            <td>Defeat the Doom of Mokhaiotl at level 3.</td>
          </tr>
          <tr>
            <td></td>
            <td>   </td>
            <td><script>ignored content</script></td>
            <td>Content with <unsupported>tags</unsupported> and <br/> breaks</td>
          </tr>
        </tbody>
      </table>
    `;

    const root = parse(problemHTML);
    const tableNode = root.querySelector("table");

    // The main test: this should not throw an error
    expect(() => {
      const tableContent = tableParser(tableNode);
      const builder = new MediaWikiBuilder();
      if (Array.isArray(tableContent)) {
        builder.addContents(tableContent);
      } else if (tableContent) {
        builder.addContent(tableContent);
      }
      builder.build();
    }).not.toThrow();
  });

  test("should ensure all table cells have buildable content", () => {
    const htmlWithProblematicCells = `
      <table>
        <tbody>
          <tr><td>Normal</td><td><script>var x = 1;</script><style>.test{}</style></td></tr>
        </tbody>
      </table>
    `;

    const root = parse(htmlWithProblematicCells);
    const tableNode = root.querySelector("table");
    expect(tableNode).toBeDefined();

    const tableContent = tableParser(tableNode);

    // Table parser should return content
    expect(tableContent).toBeDefined();

    if (Array.isArray(tableContent)) {
      const table = tableContent.find(
        (item: MediaWikiContent) => item.constructor.name === "MediaWikiTable"
      );
      expect(table).toBeDefined();

      // Verify that build() doesn't throw
      expect(() => {
        table?.build();
      }).not.toThrow();
    } else if (tableContent) {
      // Single content item
      expect(() => {
        tableContent.build();
      }).not.toThrow();
    }
  });

  test("should not crash when building MediaWiki content from filtered cells", () => {
    const mixedContentHTML = `
      <table>
        <tbody>
          <tr>
            <td>Valid <b>bold</b> content</td>
            <td><script>ignored</script>Preserved<i>italic</i></td>
            <td>   </td>
          </tr>
        </tbody>
      </table>
    `;

    const root = parse(mixedContentHTML);
    const tableNode = root.querySelector("table");
    const tableContent = tableParser(tableNode);

    // Should not throw during any part of the process
    expect(() => {
      const builder = new MediaWikiBuilder();
      if (Array.isArray(tableContent)) {
        builder.addContents(tableContent);
      } else if (tableContent) {
        builder.addContent(tableContent);
      }
      builder.build();
    }).not.toThrow();
  });

  test("should handle table cells with li elements without ul/ol wrapper", () => {
    // This reproduces the issue from https://github.com/osrs-wiki/osrs-web-scraper/issues/XXX
    const problemHTML = `
      <table>
        <tbody><tr><th>Creature</th><th> Slayer Unlock Requirements</th><th> Quantities</th><th> Weightings</th><th> Slayer Point Unlock</th>
        </tr>
        </tbody><tbody>
          <tr><td>Gryphons</td>
            <td>
              <li>51 Slayer</li>
              <li>Troubled Tortugans (45 Sailing required)</li>
              <li>60 Combat (only relevant if your settings filter tasks by combat level)</li>
            </td>
            <td> 
              <li>Vannaka: 30 - 80</li> 
              <li>Chaeldar: 60 - 100</li> 
              <li>Nieve: 110 - 170</li> 
              <li>Duradel: 100 - 210</li></td>
            <td><li>Vannaka: 5</li> 
              <li>Chaeldar: 5</li> 
              <li>Nieve: 7</li> 
              <li>Duradel: 7</li></td>
            <td> <li>Wings Spread - Allows Nieve and Duradel to assign Gryphon tasks. Costs 80 Slayer Points.</li></td></tr>
        </tbody>
      </table>
    `;

    const root = parse(problemHTML);
    const tableNode = root.querySelector("table");
    const tableContent = tableParser(tableNode);
    const builder = new MediaWikiBuilder();
    
    if (Array.isArray(tableContent)) {
      builder.addContents(tableContent);
    } else if (tableContent) {
      builder.addContent(tableContent);
    }
    
    const result = builder.build();
    
    // The result should contain the list items as bullet points
    expect(result).toContain("* 51 Slayer");
    expect(result).toContain("* Troubled Tortugans (45 Sailing required)");
    expect(result).toContain("* Vannaka: 30 - 80");
    expect(result).toContain("* Wings Spread - Allows Nieve and Duradel to assign Gryphon tasks. Costs 80 Slayer Points.");
    
    // Also verify the full output structure
    expect(result).toMatchSnapshot();
  });

  test("should handle tables with multiple tbody elements", () => {
    const multiTbodyHTML = `
      <table>
        <tbody>
          <tr><th>Header 1</th><th>Header 2</th></tr>
        </tbody>
        <tbody>
          <tr><td>Row 1 Col 1</td><td>Row 1 Col 2</td></tr>
          <tr><td>Row 2 Col 1</td><td>Row 2 Col 2</td></tr>
        </tbody>
      </table>
    `;

    const root = parse(multiTbodyHTML);
    const tableNode = root.querySelector("table");
    const tableContent = tableParser(tableNode);
    const builder = new MediaWikiBuilder();
    
    if (Array.isArray(tableContent)) {
      builder.addContents(tableContent);
    } else if (tableContent) {
      builder.addContent(tableContent);
    }
    
    const result = builder.build();
    
    // Should contain both data rows
    expect(result).toContain("Row 1 Col 1");
    expect(result).toContain("Row 1 Col 2");
    expect(result).toContain("Row 2 Col 1");
    expect(result).toContain("Row 2 Col 2");
    expect(result).toMatchSnapshot();
  });
});
