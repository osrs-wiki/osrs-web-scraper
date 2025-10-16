import {
  MediaWikiBuilder,
} from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import tableParser from "../table";

describe("table node - row headers", () => {
  test("A table with row headers (<th> in table body) should render correctly", () => {
    const root = parse(`
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>EU</th>
            <th>UK</th>
            <th>US East</th>
          </tr>
          <tr>
            <th>F2P</th>
            <td>456, 455</td>
            <td>498, 499</td>
            <td>417, 648</td>
          </tr>
          <tr>
            <th>Members</th>
            <td>335, 384</td>
            <td>380, 382</td>
            <td>629, 630</td>
          </tr>
        </tbody>
      </table>
    `);
    const builder = new MediaWikiBuilder();
    const tableNode = root.querySelector("table");
    builder.addContents([tableParser(tableNode)].flat());
    const result = builder.build();
    
    // Check that the result has the correct header markers
    expect(result).toContain("! \n! EU");
    expect(result).toContain("! F2P\n| 456, 455");
    expect(result).toContain("! Members\n| 335, 384");
    
    expect(result).toMatchSnapshot();
  });

  test("A table with all data cells should render correctly", () => {
    const root = parse(`
      <table>
        <tbody>
          <tr>
            <td>Row 1 Col 1</td>
            <td>Row 1 Col 2</td>
          </tr>
          <tr>
            <td>Row 2 Col 1</td>
            <td>Row 2 Col 2</td>
          </tr>
        </tbody>
      </table>
    `);
    const builder = new MediaWikiBuilder();
    const tableNode = root.querySelector("table");
    builder.addContents([tableParser(tableNode)].flat());
    const result = builder.build();
    
    // First row becomes header row
    expect(result).toContain("! Row 1 Col 1");
    expect(result).toContain("! Row 1 Col 2");
    // Second row should be data cells
    expect(result).toContain("| Row 2 Col 1");
    expect(result).toContain("| Row 2 Col 2");
    
    expect(result).toMatchSnapshot();
  });

  test("A table with mixed th and td in rows should render correctly", () => {
    const root = parse(`
      <table>
        <tbody>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
          </tr>
          <tr>
            <th>Row Header</th>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </table>
    `);
    const builder = new MediaWikiBuilder();
    const tableNode = root.querySelector("table");
    builder.addContents([tableParser(tableNode)].flat());
    const result = builder.build();
    
    // All cells in first row should be headers
    expect(result).toContain("! Header 1");
    expect(result).toContain("! Header 2");
    expect(result).toContain("! Header 3");
    
    // Second row should have mixed cell types
    expect(result).toContain("! Row Header");
    expect(result).toContain("| Data 1");
    expect(result).toContain("| Data 2");
    
    expect(result).toMatchSnapshot();
  });

  test("A table with thead and tbody row headers should render correctly", () => {
    const root = parse(`
      <table>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Row 1</th>
            <td>Value 1</td>
          </tr>
          <tr>
            <th>Row 2</th>
            <td>Value 2</td>
          </tr>
        </tbody>
      </table>
    `);
    const builder = new MediaWikiBuilder();
    const tableNode = root.querySelector("table");
    builder.addContents([tableParser(tableNode)].flat());
    const result = builder.build();
    
    // thead cells should be headers
    expect(result).toContain("! Column 1");
    expect(result).toContain("! Column 2");
    
    // tbody row headers should be headers
    expect(result).toContain("! Row 1");
    expect(result).toContain("! Row 2");
    
    // tbody data cells should be data
    expect(result).toContain("| Value 1");
    expect(result).toContain("| Value 2");
    
    expect(result).toMatchSnapshot();
  });
});
