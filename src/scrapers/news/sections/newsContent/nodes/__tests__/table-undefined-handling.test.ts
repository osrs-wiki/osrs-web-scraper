import {
  MediaWikiBuilder,
  MediaWikiContent,
} from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import tableParser from "../table";

describe("table parser - undefined content handling", () => {
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

  test("should handle completely empty table cells gracefully", () => {
    const htmlWithEmptyCells = `
      <table>
        <tbody>
          <tr><td>Header 1</td><td>Header 2</td></tr>
          <tr><td></td><td></td></tr>
          <tr><td>   </td><td>  \n  </td></tr>
          <tr><td><script></script><style></style></td><td><unknown></unknown></td></tr>
        </tbody>
      </table>
    `;

    const root = parse(htmlWithEmptyCells);
    const tableNode = root.querySelector("table");

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
        (item: MediaWikiContent) => item.constructor.name === "MediaWikiTable" || item.constructor.name === "ExtendedMediaWikiTable"
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
});
