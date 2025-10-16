import {
  MediaWikiBuilder,
} from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import tableParser from "../table";

describe("table node - issue example", () => {
  test("Grid Master news post table should render with row headers correctly", () => {
    // This is the exact HTML from the issue
    const root = parse(`
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>EU</th>
            <th>UK</th>
            <th>US East</th>
            <th>US West</th>
            <th>Australia</th>
          </tr>
          <tr>
            <th>F2P</th>
            <td>456, 455</td>
            <td>498, 499</td>
            <td>417, 648</td>
            <td>436, 437</td>
            <td>537, 691</td>
          </tr>
          <tr>
            <th>Members</th>
            <td>335, 384, 397, 399, 451, 452, 453, 454, 677, 678</td>
            <td>380, 382, 661, 662, 663, 664, 665, 666, 667, 623</td>
            <td>629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 618, 617, 616, 615, 614, 613, 612, 611, 610, 609, 575, 574, 490, 489, 488</td>
            <td>418, 430, 431, 433, 435, 650, 651, 608, 607, 606, 605, 604, 603, 602, 601, 600, 599, 547, 546, 545, 544, 543, 542, 541, 538</td>
            <td>591</td>
          </tr>
          <tr>
            <th>Gemstone Crab</th>
            <td>686</td>
            <td>675</td>
            <td>647</td>
            <td>659</td>
            <td>690</td>
          </tr>
          <tr>
            <th>Yama</th>
            <td>685</td>
            <td>674</td>
            <td>645</td>
            <td>658</td>
            <td>689</td>
          </tr>
          <tr>
            <th>Hueycoatl</th>
            <td>684</td>
            <td>673</td>
            <td>644</td>
            <td>657</td>
            <td>688</td>
          </tr>
          <tr>
            <th>Ent Totems</th>
            <td>683</td>
            <td>672</td>
            <td>643</td>
            <td>656</td>
            <td>687</td>
          </tr>
          <tr>
            <th>Raids</th>
            <td>682</td>
            <td>671</td>
            <td>642</td>
            <td>655</td>
            <td>595</td>
          </tr>
          <tr>
            <th>Blast Furnace</th>
            <td>681</td>
            <td>670</td>
            <td>641</td>
            <td>654</td>
            <td>594</td>
          </tr>
          <tr>
            <th>Skilling Bosses</th>
            <td>680</td>
            <td>669</td>
            <td>640</td>
            <td>653</td>
            <td>593</td>
          </tr>
          <tr>
            <th>Forestry</th>
            <td>679</td>
            <td>668</td>
            <td>639</td>
            <td>652</td>
            <td>592</td>
          </tr>
        </tbody>
      </table>
    `);
    
    const builder = new MediaWikiBuilder();
    const tableNode = root.querySelector("table");
    builder.addContents([tableParser(tableNode)].flat());
    const result = builder.build();
    
    // Verify the header row
    expect(result).toContain("! \n! EU\n! UK\n! US East\n! US West\n! Australia");
    
    // Verify F2P row has header cell followed by data cells
    expect(result).toContain("! F2P\n| 456, 455\n| 498, 499\n| 417, 648\n| 436, 437\n| 537, 691");
    
    // Verify Members row has header cell
    expect(result).toContain("! Members\n|");
    
    // Verify other row headers are present
    expect(result).toContain("! Gemstone Crab");
    expect(result).toContain("! Yama");
    expect(result).toContain("! Hueycoatl");
    expect(result).toContain("! Ent Totems");
    expect(result).toContain("! Raids");
    expect(result).toContain("! Blast Furnace");
    expect(result).toContain("! Skilling Bosses");
    expect(result).toContain("! Forestry");
    
    // Verify that data cells are marked with |
    expect(result).toContain("| 686");
    expect(result).toContain("| 685");
    expect(result).toContain("| 684");
    
    // Full snapshot test
    expect(result).toMatchSnapshot();
  });
});
